#! /usr/bin/env python

from webbaseserver.settings import config
from webbaseserver.utils import drop_database

config.configure()

if config.get('ENV', 'production') != 'development':
    answer = input('Are you sure you when to delete the database?[y/N]')
else:
    answer = 'y'

if answer == 'y':
    drop_database(config.get('MONGO_DATABASE_NAME'))

print('Done')
