#! /usr/bin/env python

import os
import asyncio
import sys

from redis import Redis
from rq import Queue
import aioredis
from aiohttp_session import redis_storage, session_middleware
import jinja2
import aiohttp_jinja2
from prometheus_client import start_http_server
from aiohttp import web

HERE = os.path.abspath(os.path.dirname(__file__))
sys.path.append(os.path.join(HERE, '..'))

from server.prometheus_instruments import db_session_gauge  # noqa
from server.routes import routes  # noqa
from server.middlewares import db_handler  # noqa
from server.settings import config, logger, ROOT  # noqa


async def on_shutdown(app):
    pass
    """
    for ws in app['websockets']:
        await ws.close(code=1001, message='Server shutdown')
    """


async def shutdown(server, app, handler):

    server.close()
    await server.wait_closed()
    await app.shutdown()
    await handler.finish_connections(10.0)
    await app.cleanup()
    await app.redis_pool.clear()


async def init(loop, config_args=None):
    # CONFIG
    config.configure(config_args)
    logger.debug('Env: {env}'.format(env=config.get('ENV')))

    # SESSION
    redis_pool = await aioredis.create_pool(('localhost', 6379))
    storage = redis_storage.RedisStorage(redis_pool)
    app = web.Application(loop=loop, middlewares=[
        session_middleware(storage),
        db_handler
    ])

    app.redis_pool = redis_pool

    # QUEUE
    app.queue = Queue(connection=Redis())

    # WEBSOCKET
    """
    app['websockets'] = []
    """

    handler = app.make_handler()

    # ROUTES
    for route in routes:
        app.router.add_route(route[0], route[1], route[2], name=route[3])

    if config.get('ENV', 'production') == 'development':
        static_path = os.path.join(ROOT, 'dist-dev')
    else:
        static_path = os.path.join(ROOT, 'dist-prod')

    app.router.add_static('/', static_path, name='static')

    aiohttp_jinja2.setup(app, loader=jinja2.FileSystemLoader(static_path))

    # PREPARE HOOK
    async def after_request(request, response):
        if hasattr(request, 'db_session'):
            request.db_session.end()
            request.db_session.db.connection.disconnect()
            db_session_gauge.dec()

    app.on_response_prepare.append(after_request)

    # SHUTDOWN
    app.on_shutdown.append(on_shutdown)

    serv_generator = loop.create_server(
        handler,
        config.get('SERVER_HOST'),
        config.get('SERVER_PORT')
    )
    return serv_generator, handler, app

if __name__ == '__main__':
    """
    loop = uvloop.new_event_loop()
    asyncio.set_event_loop(loop)
    """

# PROMETHEUS CLIENT
    start_http_server(8001)

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
