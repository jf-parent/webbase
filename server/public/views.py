from aiohttp import web
import aiohttp_jinja2
from aiohttp_session import get_session

from server.exceptions import *  # noqa
from server.settings import logger
from server.server_decorator import exception_handler
from server.auth.user import User
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
    await set_csrf_token_session(session)

    success = False
    token = session['csrf_token']
    user = None

    email = session.get('email')
    if email:
        user = request.db_session.query(User).filter(User.email == email).one()
        if user.enable:
            user = await user.serialize()
            success = True
        else:
            User.logout(session)
            user = None

    data = {'success': success, 'user': user, 'token': token}
    return web.json_response(data)
