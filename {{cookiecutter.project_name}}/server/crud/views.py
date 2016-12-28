import importlib
import traceback

from aiohttp_session import get_session
from aiohttp import web

from server import exceptions
from server.settings import logger
from server.server_decorator import (
    require,
    exception_handler,
    csrf_protected
)
from server.auth import get_user_from_session
from server.prometheus_instruments import (
    serverside_unhandled_exception_counter
)


class CRUD(web.View):

    action_list = [
        'create',
        'read',
        'update',
        'delete'
    ]

    async def get_json_data(self):
        try:
            req_data = await self.request.json()
            actions = req_data['actions']

            # Convert actions to list if necessary
            if not type(actions) == list:
                actions = [actions]

            logger.debug('actions = {actions}'.format(
                actions=actions
            ))

            return actions
        except:
            raise exceptions.InvalidRequestException(
                'No json send or missing actions parameters'
            )

    def import_model(self, model):
        try:
            m = importlib.import_module(
                'server.model.{model}'.format(model=model)
            )
            return getattr(m, model.title())
        except ImportError:
            raise exceptions.ModelImportException(
                '{model} not found'.format(model=model)
            )

    def trim_response_data(self, success, response_data, error):
        if len(response_data) == 1:
            return response_data[0]
        else:
            data = {'success': success, 'results': response_data}
            if error:
                data['error'] = error
            return data

    @exception_handler()
    @csrf_protected()
    @require('login')
    async def post(self):
        actions = await self.get_json_data()

        session = await get_session(self.request)
        author = get_user_from_session(session, self.request.db_session)

        read_context = {
            'author': author,
            'db_session': self.request.db_session,
            'ws_session': session,
            'method': 'read',
            'queue': self.request.app.queue,
        }
        action_context = {
            'author': author,
            'db_session': self.request.db_session,
            'ws_session': session,
            'queue': self.request.app.queue
        }

        success = True
        response_data = []
        error = []
        for index, action in enumerate(actions):
            try:
                # RESPONSE
                response_data.append(dict())
                response_data[index]['success'] = True
                response_data[index]['results'] = []

                # ACTION
                action_name = action.get('action')
                if not action_name:
                    raise exceptions.InvalidRequestException(
                        'Missing action in actions[{index}]'
                        .format(
                            index=index
                        )
                    )
                elif action_name not in self.action_list:
                    raise exceptions.InvalidRequestException(
                        'Invalid action name: "{action_name}"'
                        .format(
                            action_name=action_name
                        )
                    )

                action_context['method'] = action_name

                # IMPORT MODEL
                model_name = action.get('model')
                if not model_name:
                    raise exceptions.InvalidRequestException(
                        'Missing model in action'
                    )

                model_class = self.import_model(model_name)

                # CREATE
                if action_name == 'create':
                    results = [model_class()]
                    response_data[index]['total'] = 1

                # QUERY
                else:
                    # READ SPECIFIC RECORD
                    uid = action.get('uid')
                    if uid:
                        base_query = self.request.db_session\
                            .query(model_class)\
                            .filter(model_class.mongo_id == uid)

                    # BATCH
                    elif action.get('uids'):
                        uids = action.get('uids')
                        base_query = self.request.db_session.query(model_class)
                        response_data[index]['total'] = len(uids)
                        base_query = base_query.in_('mongo_id', *uids)
                        results = base_query.all()

                    else:
                        filters = action.get('filters')
                        filters_wildcard = action.get('filters_wildcard')
                        limit = action.get('limit')
                        skip = action.get('skip')
                        descending = action.get('descending')
                        ascending = action.get('ascending')

                        base_query = self.request.db_session.query(model_class)

                        if limit:
                            base_query = base_query.limit(limit)

                        if skip:
                            base_query = base_query.skip(skip)

                        if descending:
                            base_query = base_query.descending(descending)

                        if ascending:
                            base_query = base_query.ascending(ascending)

                        if filters:
                            if 'uid' in filters:
                                filters['mongo_id'] = filters['uid']
                                del filters['uid']

                            base_query = base_query.filter_by(**filters)

                        if filters_wildcard:
                            wildcard = []
                            for key, value in iter(filters_wildcard.items()):
                                wildcard.append(
                                    getattr(
                                        model_class,
                                        key
                                    ).regex('.*%s.*' % value, ignore_case=True)
                                )

                            base_query = base_query.or_(*wildcard)

                    response_data[index]['total'] = base_query.count()
                    results = base_query.all()

                # PROCESSING RESULTS
                for result in results:
                    # AUTHORIZATION CHECK
                    logger.debug(
                        'action_context = {action_context}'
                        .format(
                            action_context=action_context
                        )
                    )
                    if not await result.method_autorized(action_context):
                        raise exceptions.NotAuthorizedException(
                            '{author} not authorized to {action_name} {result}'
                            .format(
                                author=author,
                                action_name=action_name,
                                result=result
                            )
                        )

                    # APPLY ACTION
                    # CREATE & UPDATE
                    if action_name in ['create', 'update']:
                        data = action.get('data')
                        if not data:
                            raise exceptions.InvalidRequestException(
                                'Missing data in action'
                            )

                        action_context['data'] = data
                        sane_data = await result.sanitize_data(
                            action_context
                        )
                        action_context['data'] = sane_data

                        # BEFORE HOOK
                        await getattr(
                            result,
                            'before_{action_name}'
                            .format(
                                action_name=action_name
                            )
                        )(action_context)

                        await result.validate_and_save(action_context)

                        # AFTER HOOK
                        await getattr(
                            result,
                            'after_{action_name}'
                            .format(
                                action_name=action_name
                            )
                        )(action_context)

                    # DELETE
                    elif action_name == 'delete':
                        await result.before_delete(action_context)
                        self.request.db_session.remove(result, safe=True)
                        await result.after_delete(action_context)

                    if not action.get('total_only', False) \
                            and not action_name == 'delete':

                        # READ
                        # NOTE the authorization check has already
                        # been performed for the read
                        if not action_name == 'read':
                            logger.debug(
                                'read_context = {read_context}'
                                .format(
                                    read_context=read_context
                                )
                            )
                            if not await result.method_autorized(read_context):
                                raise exceptions.NotAuthorizedException(
                                    '{author} not authorized to {action_name} {result}'  # noqa
                                    .format(
                                        author=author,
                                        action_name=read_context.get('method'),
                                        result=result
                                    )
                                )
                        response_data[index]['results'].append(
                            await result.serialize(read_context)
                        )
            except Exception as e:
                success = False
                tb = traceback.format_exc()
                logger.error(
                    'Request HandledException<{exception}>'
                    .format(exception=str(tb))
                )
                if isinstance(e, exceptions.ServerBaseException):
                    error_msg = e.get_name()
                else:
                    serverside_unhandled_exception_counter.inc()
                    error_msg = 'ServerSideError'

                response_data[index] = {
                    'success': False,
                    'error': error_msg
                }
                error.append(error_msg)

        # RESPONSE
        trimmed_response_data = self.trim_response_data(
            success,
            response_data,
            error
        )
        return web.json_response(trimmed_response_data)
