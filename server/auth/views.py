from aiohttp_session import get_session
from aiohttp import web

from server.exceptions import *  # noqa
from server.model.user import User
from server.model.email_confirmation_token import EmailConfirmationToken
from server.model.reset_password_token import ResetPasswordToken
from server.settings import logger
from server.server_decorator import require, exception_handler, csrf_protected
from server.auth import set_session, get_user_from_session


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
                session = await get_session(self.request)

                context = {
                    'db_session': self.request.db_session,
                    'method': 'read',
                    'queue': self.request.app.queue
                }

                resp_data = {
                    'success': True,
                    'token': session['csrf_token'],
                    'user': await user.serialize(context)
                }
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

        context = {
            'db_session': self.request.db_session,
            'method': 'create',
            'queue': self.request.app.queue
        }

        # INIT USER
        user = User()
        context['data'] = data
        sane_data = await user.sanitize_data(context)
        context['data'] = sane_data
        await user.validate_and_save(context)

        # SET SESSION
        await set_session(user, self.request)
        session = await get_session(self.request)

        context['method'] = 'read'
        context['user'] = user
        resp_data = {
            'success': True,
            'user': await user.serialize(context),
            'token': session['csrf_token']
        }
        return web.json_response(resp_data)


class Logout(web.View):

    @exception_handler()
    @require('login')
    @csrf_protected()
    async def post(self):
        session = await get_session(self.request)
        user = get_user_from_session(session, self.request.db_session)
        user.logout(session)
        resp_data = {'success': True}
        return web.json_response(resp_data)


@exception_handler()
@require('admin')
async def api_admin(request):
    logger.debug('admin')
    session = await get_session(request)
    user = get_user_from_session(session, request.db_session)

    context = {
        'user': user,
        'db_session': request.db_session,
        'method': 'read',
        'queue': request.app.queue
    }

    resp_data = {'success': True, 'user': await user.serialize(context)}
    return web.json_response(resp_data)


@exception_handler()
@require('login')
async def api_confirm_email(request):
    logger.debug('confirm_email')

    try:
        data = await request.json()
        email_confirmation_token = data['token']
    except:
        raise InvalidRequestException('Missing json data')

    session = await get_session(request)
    user = get_user_from_session(session, request.db_session)

    context = {
        'user': user,
        'db_session': request.db_session,
        'method': 'update',
        'queue': request.app.queue
    }

    token_query = request.db_session.query(EmailConfirmationToken)\
        .filter(EmailConfirmationToken.token == email_confirmation_token)
    if token_query.count():
        email_confirmation_token = token_query.one()

        context['target'] = email_confirmation_token
        ret = email_confirmation_token.use(context)
        if ret:
            context['data'] = {'email_confirmed': True}
            del context['target']
            await user.validate_and_save(context)

            context['method'] = 'read'
            resp_data = {
                'success': True,
                'user': await user.serialize(context)
            }
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

    context = {
        'user': user,
        'db_session': request.db_session,
        'method': 'update',
        'queue': request.app.queue,
        'data': {'password': new_password}
    }

    token_query = request.db_session.query(ResetPasswordToken)\
        .filter(ResetPasswordToken.token == token)\
        .filter(ResetPasswordToken.user_uid == user.get_uid())
    if token_query.count():
        reset_password_token = token_query.one()
        if reset_password_token.token == token:
            await user.validate_and_save(context)

            resp_data = {'success': True}
            return web.json_response(resp_data)

        else:
            raise TokenInvalidException('Token mismatch')

    else:
        raise TokenInvalidException('Token not found')
