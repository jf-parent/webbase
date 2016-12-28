from aiohttp import web
import aiohttp_jinja2
from aiohttp_session import get_session

from server import exceptions
from server.settings import logger, config
from server.server_decorator import exception_handler, csrf_protected
from server.model.user import User
from server.model.resetpasswordtoken import Resetpasswordtoken
from server.auth import set_session, get_user_from_session
from server.utils import generate_token


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
    data = await request.json()
    await set_csrf_token_session(session)

    success = False
    token = session['csrf_token']
    user = None

    uid = session.get('uid')
    if uid:
        user = get_user_from_session(session, request.db_session)
        session['tz'] = data.get('user_timezone')
        if user.enable:
            context = {
                'user': user,
                'db_session': request.db_session,
                'ws_session': session,
                'method': 'read',
                'queue': request.app.queue
            }

            user = await user.serialize(context)
            success = True
        else:
            user.logout(session)
            user = None

    resp_data = {'success': success, 'user': user, 'token': token}
    return web.json_response(resp_data)


@exception_handler()
@csrf_protected()
async def api_validate_reset_password_token(request):
    logger.debug('validate_reset_password_token')

    session = await get_session(request)

    try:
        data = await request.json()
        reset_password_token = data['reset_password_token']
    except:
        raise exceptions.InvalidRequestException('Missing json data')

    session['tz'] = data.get('user_timezone')

    token_query = request.db_session.query(Resetpasswordtoken)\
        .filter(Resetpasswordtoken.token == reset_password_token)
    if token_query.count():
        reset_password_token = token_query.one()
        user = request.db_session.query(User)\
            .filter(User.mongo_id == reset_password_token.user_uid).one()

        context = {
            'user': user,
            'db_session': request.db_session,
            'ws_session': session,
            'method': 'update',
            'target': reset_password_token,
            'queue': request.app.queue
        }

        ret = reset_password_token.use(context)
        if ret:
            await set_session(user, request)
            context['method'] = 'read'
            resp_data = {
                'success': True,
                'user': await user.serialize(context)
            }
            return web.json_response(resp_data)

    # TOKEN NOT FOUND
    else:
        raise exceptions.TokenInvalidException('Token not found')


@exception_handler()
@csrf_protected()
async def api_send_reset_password_token(request):
    logger.debug('send_reset_password_token')

    session = await get_session(request)

    try:
        data = await request.json()
        email = data['email']
    except:
        raise exceptions.InvalidRequestException('Missing json data')

    user_query = request.db_session.query(User)\
        .filter(User.email == email)
    if user_query.count():
        user = user_query.one()

        # NOTE disable user cannot reset their password
        if not user.enable:
            raise exceptions.EmailNotFound(
                '{email} belong to a disabled user'.format(email=email)
                )

        context = {
            'user': user,
            'db_session': request.db_session,
            'ws_session': session,
            'method': 'create',
            'data': {
                'user_uid': user.get_uid()
            },
            'queue': request.app.queue
        }

        reset_password_token = Resetpasswordtoken()
        await reset_password_token.validate_and_save(context)

        resp_data = {'success': True}

        # TEST
        if config.get('env', 'production') in ['development', 'test']:
            resp_data['reset_password_token'] = reset_password_token.token

        return web.json_response(resp_data)

    # EMAIL NOT FOUND
    else:
        raise exceptions.EmailNotFound(email)


@exception_handler()
async def api_check_email_disponibility(request):
    logger.debug('check_email_disponibility')

    try:
        data = await request.json()
        email = data['email']
    except:
        raise exceptions.InvalidRequestException('Missing json data')

    available = not request.db_session.query(User)\
        .filter(User.email == email).count()

    resp_data = {'success': True, 'available': available}
    return web.json_response(resp_data)
