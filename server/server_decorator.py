import functools

from aiohttp import web
from aiohttp.abc import AbstractView
from aiohttp_security import remember, forget, authorized_userid, permits

from server.settings import logger
from server.exceptions import *

def require(permission):
    def wrapper(func):
        @functools.wraps(func)
        async def wrapped(*args):
            # Supports class based views see web.View
            if isinstance(args[0], AbstractView):
                request = args[0].request
            else:
                request = args[-1]

            logger.debug('require: %s'%permission)
            has_perm = await permits(request, permission)
            if not has_perm:
                raise web.HTTPForbidden(body=b'Forbidden require')

            return (await func(request))
        return wrapped
    return wrapper

def exception_handler():
    def wrapper(func):
        @functools.wraps(func)
        async def wrapped(*args):
            try:
                # Supports class based views see web.View
                if isinstance(args[0], AbstractView):
                    return (await func(*args))
                else:
                    request = args[-1]
                    return (await func(request))
            except Exception as e:
                logger.error('Request Exception<{exception}>'.format(exception = str(e)))
                if isinstance(e, ServerBaseException):
                    data = {'success': False, 'error': e.get_name()}
                else:
                    data = {'success': False, 'error': 'ServerSideError'}

                return web.json_response(data)

        return wrapped
    return wrapper

