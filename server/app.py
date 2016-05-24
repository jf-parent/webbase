#! /usr/bin/env python

import os
import asyncio
import sys
import base64

sys.path.append('.')

from IPython import embed
import jinja2
import aiohttp_jinja2
from cryptography import fernet
import uvloop
import aiohttp_debugtoolbar
from aiohttp_session import session_middleware
from aiohttp_session.cookie_storage import EncryptedCookieStorage
from aiohttp import web
from aiohttp_security import setup as setup_security
from aiohttp_security import SessionIdentityPolicy

from server import routes, config, logger, ROOT, db_handler, DBAuthorizationPolicy

async def on_shutdown(app):
    for ws in app['websockets']:
        await ws.close(code=1001, message='Server shutdown')


async def shutdown(server, app, handler):

    server.close()
    await server.wait_closed()
    #app.client.close()  # database connection close
    await app.shutdown()
    await handler.finish_connections(10.0)
    await app.cleanup()


async def init(loop):

    fernet_key = fernet.Fernet.generate_key()
    secret_key = base64.urlsafe_b64decode(fernet_key)
    app = web.Application(loop=loop, middlewares=[
        session_middleware(EncryptedCookieStorage(secret_key)),
        db_handler
    ])

    #WEBSOCKET
    app['websockets'] = []
    handler = app.make_handler()

    #ROUTES
    for route in routes:
        app.router.add_route(route[0], route[1], route[2], name=route[3])

    #STATIC
    if config.get('DEBUG'):
        static_path = os.path.join(ROOT, 'dev')
    else:
        static_path = os.path.join(ROOT, 'prod')

    app.router.add_static('/', static_path, name='static')

    aiohttp_jinja2.setup(app, loader=jinja2.FileSystemLoader(static_path))

    #DB
    #app.client = ma.AsyncIOMotorClient(config.get('MONGO_HOST'))
    #app.db = app.client[config.get('MONGO_DATABASE_NAME')]

    #AUTH
    setup_security(
        app,
        SessionIdentityPolicy(), #TODO investiate session_key
        DBAuthorizationPolicy(None)
    )

    #PREPARE HOOK
    async def after_request(request, response):
        if hasattr(request, 'session'):
            request.db_session.end()
            request.db_session.db.connection.disconnect()

    app.on_response_prepare.append(after_request)

    #SHUTDOWN
    app.on_shutdown.append(on_shutdown)

    serv_generator = loop.create_server(handler, config.get('SERVER_HOST'), config.get('SERVER_PORT'))
    return serv_generator, handler, app

"""
loop = uvloop.new_event_loop()
asyncio.set_event_loop(loop)
"""
loop = asyncio.get_event_loop()

serv_generator, handler, app = loop.run_until_complete(init(loop))
serv = loop.run_until_complete(serv_generator)

logger.debug('Server listening at %s' % str(serv.sockets[0].getsockname()))
try:
    loop.run_forever()

except KeyboardInterrupt:
    logger.debug('Server stopping...')

finally:
    loop.run_until_complete(shutdown(serv, app, handler))
    loop.close()

logger.debug('Server stopped')
