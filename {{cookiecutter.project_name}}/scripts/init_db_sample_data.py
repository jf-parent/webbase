#! /usr/bin/env python

import sys
import os
from time import sleep
import asyncio

HERE = os.path.abspath(os.path.dirname(__file__))
ROOT = os.path.join(HERE, '..')

sys.path.append(ROOT)

from server.utils import drop_database  # noqa
from server.model.user import User  # noqa
from server.settings import config  # noqa
from server.model.notification import Notification  # noqa
from server.utils import DbSessionContext  # noqa

config.configure()
loop = asyncio.get_event_loop()
asyncio.set_event_loop(loop)

if config.get('env', 'production') != 'development':
    print('The "env" variable is not set to development')
    sys.exit(1)

DB_NAME = config.get('mongo_database_name')
drop_database(DB_NAME, config.get('redis_database'))

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
