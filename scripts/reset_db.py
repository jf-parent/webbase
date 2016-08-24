#! /usr/bin/env python

import os
import sys

HERE = os.path.abspath(os.path.dirname(__file__))
ROOT = os.path.join(HERE, '..')
sys.path.append(ROOT)

from server.settings import config  # noqa
from server.utils import drop_database  # noqa

config.configure()

if config.get('env', 'production') != 'development':
    answer = input('Are you sure you when to delete the database?[y/N]')
else:
    answer = 'y'

if answer == 'y':
    drop_database(
        config.get('mongo_database_name'),
        config.get('redis_database')
    )

print('Done')
