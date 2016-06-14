import time

from aiohttp_session import get_session
from aiohttp import web

from server.exceptions import *  # noqa
from server.auth.user import User
from server.settings import logger, config
from server.server_decorator import require, exception_handler, csrf_protected
from server.prometheus_instruments import active_user_gauge
from jobs.send_email import send_email


def get_user_from_session(session, db_session):
    return db_session.query(User).filter(User.email == session['email']).one()


async def set_session(user, request):
    session = await get_session(request)
    session['email'] = user.email
    session['last_visit'] = time.time()
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
                raise WrongEmailOrPasswordException(
                    "Wrong password: '{password}'"
                    .format(password=password)
                )
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
        await user.init_and_validate(self.request.db_session, data)

        # SET SESSION
        await set_session(user, self.request)

        if config.get('ENV', 'production') == 'production':
            # FORMAT EMAIL TEMPLATE
            email = config.get('email_confirmation_email')
            email['text'] = email['text'].format(
                email_validation_token=user.email_validation_token
            )
            email['html'] = email['html'].format(
                email_validation_token=user.email_validation_token
            )
            email['to'][0]['email'] = email['to'][0]['email'].format(
                user_email=user.email
            )
            email['to'][0]['name'] = email['to'][0]['name'].format(
                user_name=user.name
            )

            # ADD THE SEND EMAIL TO THE QUEUE
            self.request.app.queue.enqueue(
                send_email,
                config.get('REST_API_ID'),
                config.get('REST_API_SECRET'),
                email
            )

        # SAVE
        self.request.db_session.save(user, safe=True)

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
    email = session.get('email')
    user = request.db_session.query(User).filter(User.email == email).one()
    resp_data = {'success': True, 'user': await user.serialize()}
    return web.json_response(resp_data)


@exception_handler()
@require('login')
async def api_confirm_email(request):
    logger.debug('confirm_email')

    session = await get_session(request)
    params = await request.json()

    email_validation_token = params['token']

    user_query = request.db_session.query(User)\
        .filter(User.email_validation_token == email_validation_token)
    if user_query.count():
        user = user_query.one()

        # SESSION EMAIL MISMATCH TOKEN EMAIL
        if session['email'] != user.email:
            raise EmailMismatchException(
                'token email ("{temail}") session email ("{semail}")'
                .format(
                    temail=user.email,
                    semail=session['email']
                )
            )

        # EMAIL ALREADY CONFIRMED
        if user.email_confirmed:
            raise EmailAlreadyConfirmedException('email already confirmed')
        else:
            user.email_confirmed = True
            request.db_session.save(user, safe=True)
            resp_data = {'success': True, 'user': await user.serialize()}
            return web.json_response(resp_data)

    # TOKEN NOT FOUND
    else:
        raise EmailValidationTokenInvalidException('token not found')


@exception_handler()
@csrf_protected()
@require('login')
async def api_reset_password(request):
    logger.debug('reset_password')

    try:
        data = await request.json()
        new_password = data['password']
        reset_password_token = data['reset_password_token']
    except:
        raise InvalidRequestException('Missing json data')

    session = await get_session(request)

    user = get_user_from_session(session, request.db_session)

    if reset_password_token == user.reset_password_token:
        user.reset_password_token = ''
        await user.set_password(new_password)
        request.db_session.save(user, safe=True)

        resp_data = {'success': True}
        return web.json_response(resp_data)

    else:
        raise ResetPasswordTokenInvalidException('Token mismatch')
