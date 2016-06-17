import importlib

from aiohttp_session import get_session
from aiohttp import web

from server.exceptions import *  # noqa
from server.model.user import User
from server.model.email_confirmation_token import EmailConfirmationToken
from server.model.reset_password_token import ResetPasswordToken
from server.settings import logger
from server.server_decorator import require, exception_handler, csrf_protected
from server.prometheus_instruments import active_user_gauge


def get_user_from_session(session, db_session):
    try:
        return db_session.query(User)\
            .filter(User.mongo_id == session['uid']).one()
    except:
        return False


async def set_session(user, request):
    session = await get_session(request)
    session['uid'] = user.get_uid()
    active_user_gauge.inc()


class Login(web.View):

    @exception_handler()
    @csrf_protected()
    async def post(self):
        try:
            data = await self.request.json()
            email = data['email']
            password = data['password']
        except:
            raise InvalidRequestException('No json send')

        query = self.request.db_session.query(User)\
            .filter(User.email == email)
        if query.count():
            user = query.one()
            is_password_valid = await user.check_password(password)
            is_enable = user.enable
            if is_password_valid and is_enable:
                await set_session(user, self.request)
                resp_data = {'success': True, 'user': await user.serialize()}
            else:
                raise WrongEmailOrPasswordException()
        else:
            raise WrongEmailOrPasswordException(
                "Wrong email: '{email}'".format(email=email)
            )

        return web.json_response(resp_data)


class Register(web.View):

    @exception_handler()
    @csrf_protected()
    async def post(self):
        try:
            data = await self.request.json()
        except:
            raise InvalidRequestException('No json send')

        # INIT USER
        user = User()
        sane_data = await user.sanitize_data(data)
        await user.validate_and_save(
            self.request.db_session,
            sane_data,
            queue=self.request.app.queue
        )

        # SET SESSION
        await set_session(user, self.request)

        resp_data = {'success': True, 'user': await user.serialize()}
        return web.json_response(resp_data)


class Logout(web.View):

    @exception_handler()
    @require('login')
    @csrf_protected()
    async def post(self):
        session = await get_session(self.request)
        User.logout(session)
        resp_data = {'success': True}
        return web.json_response(resp_data)


@exception_handler()
@require('admin')
async def api_admin(request):
    logger.debug('admin')
    session = await get_session(request)
    uid = session.get('uid')
    user = request.db_session.query(User).filter(User.mongo_id == uid).one()
    resp_data = {'success': True, 'user': await user.serialize()}
    return web.json_response(resp_data)


@exception_handler()
@require('login')
async def api_confirm_email(request):
    logger.debug('confirm_email')

    session = await get_session(request)
    user = get_user_from_session(session, request.db_session)

    try:
        data = await request.json()
        email_confirmation_token = data['token']
    except:
        raise InvalidRequestException('Missing json data')

    token_query = request.db_session.query(EmailConfirmationToken)\
        .filter(EmailConfirmationToken.token == email_confirmation_token)
    if token_query.count():
        email_confirmation_token = token_query.one()

        ret = email_confirmation_token.use(
            request.db_session,
            user,
            email_confirmation_token
        )
        if ret:
            await user.validate_and_save(
                request.db_session,
                {'email_confirmed': True}
            )

            resp_data = {'success': True, 'user': await user.serialize()}
            return web.json_response(resp_data)

    # TOKEN NOT FOUND
    else:
        raise TokenInvalidException('token not found')


@exception_handler()
@csrf_protected()
@require('login')
async def api_reset_password(request):
    logger.debug('reset_password')

    try:
        data = await request.json()
        new_password = data['password']
        token = data['reset_password_token']
    except:
        raise InvalidRequestException('Missing json data')

    session = await get_session(request)
    user = get_user_from_session(session, request.db_session)

    token_query = request.db_session.query(ResetPasswordToken)\
        .filter(ResetPasswordToken.token == token)
    if token_query.count():
        reset_password_token = token_query.one()
        if reset_password_token.token == token:
            await user.validate_and_save(
                request.db_session,
                {
                    'password': new_password
                }
            )

            resp_data = {'success': True}
            return web.json_response(resp_data)

        else:
            raise TokenInvalidException('Token mismatch')

    else:
        raise TokenInvalidException('Token not found')


@exception_handler()
@csrf_protected()
@require('login')
async def api_save_model(request):
    logger.debug('save_model')

    try:
        resq_data = await request.json()
        model = resq_data['model']
        data = resq_data['data']
    except:
        raise InvalidRequestException('Missing json data')

    try:
        m = importlib.import_module('server.model.{model}'.format(model=model))
        model_class = getattr(m, model.title())
    except ImportError:
        raise ModelImportException('{model} not found'.format(model=model))

    session = await get_session(request)

    model_obj = request.db_session.query(model_class)\
        .filter(model_class.mongo_id == data['uid']).one()

    user = get_user_from_session(session, request.db_session)
    if await model_obj.edition_autorized(user):
        sane_data = await model_obj.sanitize_data(data, user)
        await model_obj.validate_and_save(
            request.db_session,
            sane_data,
            queue=request.app.queue
        )
    else:
        raise NotAuthorizedException(
            'User ({user}) not authorized to edit {model_obj}'.format(
                user=user,
                model_obj=model_obj
            )
        )

    resp_data = {'success': True, model: await model_obj.serialize()}
    return web.json_response(resp_data)
