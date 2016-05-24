import json
import time

from bson.objectid import ObjectId
from aiohttp_session import get_session
from aiohttp import web

from server.exceptions import *
from server.auth.user import User
from server.server_decorator import require, exception_handler
from server.settings import logger

async def set_session(user, request):
    session = await get_session(request)
    session['username'] = user.username
    session['last_visit'] = time.time()

class Login(web.View):

    @exception_handler()
    async def post(self):
        data = await self.request.json()
        query = self.request.db_session.query(User).filter(User.email == data.get('email'))
        if query.count():
            user = query.one()
            is_password_valid = await user.check_password(data.get('password'))
            is_enable = user.enable
            if is_password_valid and is_enable:
                await set_session(user, self.request)
                data = {'success': True, 'user': await user.serialize()}
            else:
                raise WrongEmailOrPasswordException("Wrong password: '%s'"%data['password'])
        else:
            raise WrongEmailOrPasswordException("Wrong email: '%s'"%data['email'])

        return web.json_response(data)

class Register(web.View):

    @exception_handler()
    async def post(self, **kwargs):
        data = await self.request.json()
        user = User()
        await user.init_and_validate(self.request.db_session, data)
        self.request.db_session.add(user)
        await set_session(user, self.request)
        data = {'success': True, 'user': await user.serialize()}

        return web.json_response(data)

class Logout(web.View):

    @require('login')
    @exception_handler()
    async def get(self, **kwargs):
        session = await get_session(self.request)
        if session.get('username'):
            del session['username']
            raise web.HTTPOk()
        else:
            #NOTE that should never happen
            raise web.HTTPForbidden(body=b'Forbidden logout')
