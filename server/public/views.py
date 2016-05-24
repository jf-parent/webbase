import json

from aiohttp import web
import aiohttp_jinja2
from aiohttp_session import get_session

from server.settings import logger
from server.server_decorator import require, exception_handler
from server.auth.user import User

@aiohttp_jinja2.template('index.html')
async def index(request):
    logger.debug('index')
    return {}

@exception_handler()
async def api_get_session(request):
    logger.debug('get_session')
    session = await get_session(request)
    username = session.get('username')
    if username:
        user = request.db_session.query(User).filter(User.username == username).one()
        if user:
            data = {'success': True, 'user': await user.serialize()}
            return web.json_response(data)

    data = {'success': False}
    return web.json_response(data)
