from aiohttp import web
import aiohttp_jinja2
from aiohttp_session import get_session

from server.exceptions import *  # noqa
from server.settings import logger, config
from server.server_decorator import exception_handler, csrf_protected
from server.model.user import User
from server.auth.views import set_session, get_user_from_session
from server.utils import generate_token
from jobs.send_email import send_email


async def set_csrf_token_session(session):
    if session.new:
        session['csrf_token'] = generate_token(20)


@aiohttp_jinja2.template('index.html')
async def index(request):
    logger.debug('index')
    return {}


@exception_handler()
async def api_get_session(request):
    logger.debug('get_session')

    session = await get_session(request)
    await set_csrf_token_session(session)

    success = False
    token = session['csrf_token']
    user = None

    uid = session.get('uid')
    if uid:
        user = get_user_from_session(session, request.db_session)
        if user.enable:
            user = await user.serialize()
            success = True
        else:
            User.logout(session)
            user = None

    resp_data = {'success': success, 'user': user, 'token': token}
    return web.json_response(resp_data)


@exception_handler()
@csrf_protected()
async def api_validate_reset_password_token(request):
    logger.debug('validate_reset_password_token')

    try:
        data = await request.json()
        reset_password_token = data['reset_password_token']
    except:
        raise InvalidRequestException('Missing json data')

    user_query = request.db_session.query(User)\
        .filter(User.reset_password_token == reset_password_token)
    if user_query.count():
        user = user_query.one()
        await set_session(user, request)
        resp_data = {'success': True, 'user': await user.serialize()}
        return web.json_response(resp_data)

    # TOKEN NOT FOUND
    else:
        raise ResetPasswordTokenInvalidException('Token not found')


@exception_handler()
@csrf_protected()
async def api_send_reset_password_token(request):
    logger.debug('send_reset_password_token')

    try:
        data = await request.json()
        email = data['email']
    except:
        raise InvalidRequestException('Missing json data')

    user_query = request.db_session.query(User)\
        .filter(User.email == email)
    if user_query.count():
        user = user_query.one()

        # NOTE disable user cannot reset their password
        if not user.enable:
            raise EmailNotFound(
                '{email} belong to a disabled user'.format(email=email)
                )

        reset_password_token = generate_token(20)

        if config.get('ENV', 'production') == 'production':
            # FORMAT EMAIL TEMPLATE
            email = config.get('reset_password_email')
            email['text'] = email['text'].format(
                reset_password_token=reset_password_token
            )
            email['html'] = email['html'].format(
                reset_password_token=reset_password_token
            )
            email['to'][0]['email'] = email['to'][0]['email'].format(
                user_email=user.email
            )
            email['to'][0]['name'] = email['to'][0]['name'].format(
                user_name=user.name
            )

            # ADD THE SEND EMAIL TO THE QUEUE
            request.app.queue.enqueue(
                send_email,
                config.get('REST_API_ID'),
                config.get('REST_API_SECRET'),
                email
            )

        await user.validate_and_save(
            request.db_session,
            {
                'reset_password_token': reset_password_token
            }
        )
        resp_data = {'success': True}

        # TEST
        if config.get('ENV', 'production') == 'test':
            resp_data['reset_password_token'] = reset_password_token

        return web.json_response(resp_data)

    # EMAIL NOT FOUND
    else:
        raise EmailNotFound(email)
