import time

from aiohttp_session import get_session
from aiohttp import web

from server.exceptions import *  # noqa
from server.auth.user import User
from server.settings import logger
from server.server_decorator import require, exception_handler, csrf_protected
from server.prometheus_instruments import active_user_gauge


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
        except:
            raise InvalidRequestException('No json send')

        query = self.request.db_session.query(User)\
            .filter(User.email == data.get('email'))
        if query.count():
            user = query.one()
            is_password_valid = await user.check_password(data.get('password'))
            is_enable = user.enable
            if is_password_valid and is_enable:
                await set_session(user, self.request)
                data = {'success': True, 'user': await user.serialize()}
            else:
                raise WrongEmailOrPasswordException(
                    "Wrong password: '{password}'"
                    .format(password=data['password'])
                )
        else:
            raise WrongEmailOrPasswordException(
                "Wrong email: '{email}'".format(email=data['email'])
            )

        return web.json_response(data)


class Register(web.View):

    @exception_handler()
    @csrf_protected()
    async def post(self):
        try:
            data = await self.request.json()
        except:
            raise InvalidRequestException('No json send')

        user = User()
        await user.init_and_validate(self.request.db_session, data)
        self.request.db_session.save(user)
        await set_session(user, self.request)
        data = {'success': True, 'user': await user.serialize()}

        return web.json_response(data)


class Logout(web.View):

    @exception_handler()
    @require('login')
    @csrf_protected()
    async def post(self):
        session = await get_session(self.request)
        User.logout(session)
        data = {'success': True}
        return web.json_response(data)


@exception_handler()
@require('admin')
async def api_admin(request):
    logger.debug('admin')
    session = await get_session(request)
    email = session.get('email')
    user = request.db_session.query(User).filter(User.email == email).one()
    data = {'success': True, 'user': await user.serialize()}
    return web.json_response(data)
