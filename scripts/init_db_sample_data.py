#! /usr/bin/env python

from time import sleep
import asyncio
import sys
import os

sys.path.append('.')

from mongoalchemy.session import Session

from server.utils import drop_database
from server.model.user import User
from server.settings import config
from server.model.email_confirmation_token import EmailConfirmationToken  # noqa
from server.model.reset_password_token import ResetPasswordToken  # noqa
from server.model.notification import Notification  # noqa
from server.utils import DbSessionContext  # noqa

config.configure()
loop = asyncio.get_event_loop()
asyncio.set_event_loop(loop)

if config.get('ENV', 'production') != 'development':
    print('The "ENV" variable is not set to development')
    sys.exit(1)

DB_NAME = config.get('MONGO_DATABASE_NAME')
drop_database(DB_NAME)

with DbSessionContext(DB_NAME) as session:
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
        context = {
            'db_session': session,
            'method': 'create',
            'data': user_data
        }

        loop.run_until_complete(user.validate_and_save(context))
        if user.name == 'test':
            for index in range(40):
                notification = Notification()
                notification_data = {
                    'user_uid': user.get_uid(),
                    'message': 'Test {index}',
                    'target_url': '/profile',
                    'template_data': {
                        'index': str(index)
                    }
                }

                context = {
                    'db_session': session,
                    'method': 'create',
                    'data': notification_data
                }

                loop.run_until_complete(
                    notification.validate_and_save(context)
                )
                sleep(.1)
