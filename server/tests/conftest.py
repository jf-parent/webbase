import asyncio
import os
import sys

import pytest
from webtest_aiohttp import TestApp

HERE = os.path.abspath(os.path.dirname(__file__))
sys.path.append(os.path.join(HERE, '..', '..'))

from server.app import init  # noqa
from server.auth.user import User  # noqa
from server.utils import DbSessionContext  # noqa


@pytest.fixture
def client():
    loop = asyncio.get_event_loop()
    asyncio.set_event_loop(loop)

    config = {
        "ENV": "test",
        "MONGO_DATABASE_NAME": "webbase_test",
        "MONGO_HOST": "127.0.0.1",
        "SERVER_PORT": 1337,
        "SERVER_HOST": "localhost",
        "MASTER_PASSWORD": "Wkjdfkjdfjkdjkj"
    }

    _, _, app = loop.run_until_complete(init(loop, config))

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:

        # CLEAR
        session.clear_collection(User)

        # INSERT DUMMY DATA
        users = [
            {
                'name': 'test',
                'email': 'test@test.com',
                'email_validation_token': '123456',
                'password': '123456'
            }, {
                'name': 'to.disable',
                'email': 'to.disable@to.disable.com',
                'email_validation_token': '1337',
                'password': '123456'
            }, {
                'name': 'admin',
                'email': 'admin@admin.com',
                'password': '123456',
                'role': 'admin'
            }, {
                'name': 'disabled',
                'email': 'disabled@disabled.com',
                'password': '123456',
                'enable': False
            }
        ]

        for user_data in users:
            user = User()
            loop.run_until_complete(user.init_and_validate(session, user_data))
            session.save(user, safe=True)

    client = TestApp(app)

    # NOTE Always do an /api/get_session to init the session correctly
    response = client.get('/api/get_session')
    client.__token__ = response.json['token']

    return client
