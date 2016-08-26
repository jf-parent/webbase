import functools
import traceback

from aiohttp import web
from aiohttp.abc import AbstractView
from aiohttp_session import get_session

from server.auth import permits
from server.settings import logger
from server import exceptions
from server.prometheus_instruments import (
    security_violation_attempt_counter,
    serverside_unhandled_exception_counter
)


def require(permission):
    def wrapper(func):
        @functools.wraps(func)
        async def wrapped(*args):
            logger.debug('require: {permission}'.format(permission=permission))

            # Supports class based views see web.View
            if isinstance(args[0], AbstractView):
                request = args[0].request
                params = args[0]  # self
            else:
                request = args[-1]
                params = request  # request

            session = await get_session(request)
            has_perm = permits(request, session, permission)
            if not has_perm:
                if permission == 'admin':
                    security_violation_attempt_counter.inc()
                raise exceptions.NotAuthorizedException(permission)

            return (await func(params))
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
                    return (await func(args[-1]))
            except exceptions.CSRFMismatch as e:
                security_violation_attempt_counter.inc()
                data = {'success': False, 'error': 'CSRFMismatch'}

                return web.json_response(data)
            except Exception as e:
                tb = traceback.format_exc()
                logger.error(
                    'Request HandledException<{exception}>'
                    .format(exception=str(tb))
                )
                if isinstance(e, exceptions.ServerBaseException):
                    data = {'success': False, 'error': e.get_name()}
                else:
                    serverside_unhandled_exception_counter.inc()
                    data = {'success': False, 'error': 'ServerSideError'}

                return web.json_response(data)

        return wrapped
    return wrapper


def csrf_protected():
    def wrapper(func):
        @functools.wraps(func)
        async def wrapped(*args):
            logger.debug('csrf_protected')

            # Supports class based views see web.View
            if isinstance(args[0], AbstractView):
                request = args[0].request
                params = args[0]  # self
            else:
                request = args[-1]
                params = request  # request

            session = await get_session(request)
            try:
                data = await request.json()
            except:
                raise exceptions.InvalidRequestException('No json send')

            csrf_token_session = session.get('csrf_token')
            csrf_token_request = data.get('token')
            if csrf_token_request != csrf_token_session:
                raise exceptions.CSRFMismatch()

            return (await func(params))
        return wrapped
    return wrapper
