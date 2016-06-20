import asyncio
import types
import os
import sys

import pytest
from webtest_aiohttp import TestApp

HERE = os.path.abspath(os.path.dirname(__file__))
sys.path.append(os.path.join(HERE, '..', '..'))

from server.app import init  # noqa
from server.model.user import User  # noqa
from server.model.notification import Notification  # noqa
from server.model.email_confirmation_token import EmailConfirmationToken  # noqa
from server.model.reset_password_token import ResetPasswordToken  # noqa
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
        session.clear_collection(EmailConfirmationToken)
        session.clear_collection(ResetPasswordToken)

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

        notifications = [
            {
                'user_uid': None,
                'message': 'Test 1'
            }, {
                'user_uid': None,
                'message': 'Test 2'
            }, {
                'user_uid': None,
                'message': 'Test 3'
            }, {
                'user_uid': None,
                'message': 'Test 4',
                'seen': True
            }
        ]

        for user_data in users:
            user = User()
            loop.run_until_complete(user.validate_and_save(session, user_data))
            for notification_data in notifications:
                notification = Notification()
                notification_data['user_uid'] = user.get_uid()
                loop.run_until_complete(
                    notification.validate_and_save(session, notification_data)
                )

    def login(self, email, password='123456'):
        self.post_json(
            '/api/login',
            {
                'email': email,
                'password': password,
                'token': self.__token__
            }
        )
        with DbSessionContext(
            self.config.get('MONGO_DATABASE_NAME')
        ) as session:
            user = session.query(User)\
                .filter(User.email == email).one()

        return user

    client = TestApp(app)
    client.config = config
    client.login = types.MethodType(login, client)

    # NOTE Always do an /api/get_session to init the session correctly
    response = client.get('/api/get_session')
    client.__token__ = response.json['token']

    return client
