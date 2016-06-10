#! /usr/bin/env python

import sys
import os

sys.path.append('.')

from mongoalchemy.session import Session

from server.utils import DbSessionContext  # noqa
from server.auth.user import User
from server.settings import config

config.configure()

if not config.get('DEBUG'):
    answer = input('Are you sure you when to delete the database?[y/N]')
else:
    answer = 'y'

if answer == 'y':
    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        session.clear_collection(User)
        print('Collection User deleted')

print('Done')
