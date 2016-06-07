import asyncio
import os, sys

import pytest
from aiohttp import web
from webtest_aiohttp import TestApp

HERE = os.path.abspath(os.path.dirname(__file__))
sys.path.append(os.path.join(HERE, '..', '..'))

from server.app import init


@pytest.fixture
def client():
    loop = asyncio.get_event_loop()
    asyncio.set_event_loop(loop)

    config = {
        "DEBUG": False,
        "MONGO_DATABASE_NAME": "webbase_test",
        "MONGO_HOST": "127.0.0.1",
        "SERVER_PORT": 1337,
        "SERVER_HOST": "localhost",
        "MASTER_PASSWORD": "Wkjdfkjdfjkdjkj"
    }

    _, _, app = loop.run_until_complete (init(loop, config))

    return TestApp(app)
