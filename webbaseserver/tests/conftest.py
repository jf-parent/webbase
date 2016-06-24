import asyncio
import types

import pytest
from webtest_aiohttp import TestApp

from webbaseserver.app import init  # noqa
from webbaseserver.model.user import User  # noqa
from webbaseserver.model.notification import Notification  # noqa
from webbaseserver.model.email_confirmation_token import EmailConfirmationToken  # noqa
from webbaseserver.model.reset_password_token import ResetPasswordToken  # noqa
from webbaseserver.utils import DbSessionContext, drop_database  # noqa


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

    drop_database(config.get('MONGO_DATABASE_NAME'))

    _, _, app = loop.run_until_complete(init(loop, config))

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:

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
            context = {
                'db_session': session,
                'method': 'create',
                'data': user_data
            }

            loop.run_until_complete(user.validate_and_save(context))
            for notification_data in notifications:
                notification = Notification()
                notification_data['user_uid'] = user.get_uid()

                context = {
                    'db_session': session,
                    'method': 'create',
                    'data': notification_data
                }

                loop.run_until_complete(
                    notification.validate_and_save(context)
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
