from aiohttp import web
import aiohttp_jinja2
from aiohttp_session import get_session

from server.settings import logger
from server.server_decorator import exception_handler, require
from server.auth.user import User


@aiohttp_jinja2.template('index.html')
async def index(request):
    logger.debug('index')
    return {}


@exception_handler()
@require('login')
async def api_get_session(request):
    logger.debug('get_session')
    session = await get_session(request)
    email = session.get('email')
    user = request.db_session.query(User).filter(User.email == email).one()
    data = {'success': True, 'user': await user.serialize()}
    return web.json_response(data)
