from datetime import datetime
import os
import binascii
from dateutil import tz
import pytz

import jinja2
from mongoalchemy.fields import StringField

from server.database import (
    _get_session,
    _get_client,
    _DbSessionContext,
    _drop_database
)


def get_session(config):
    return _get_session(
        config.get('mongo_database_name'),
        db_host=config.get('mongo_host'),
        db_port=config.get('mongo_port'),
        db_user=config.get('mongo_user'),
        db_pwd=config.get('mongo_pwd')
    )


def get_client(config):
    return _get_client(
        db_host=config.get('mongo_host'),
        db_port=config.get('mongo_port'),
        db_user=config.get('mongo_user'),
        db_pwd=config.get('mongo_pwd')
    )


def drop_database(config):
    return _drop_database(
        config.get('mongo_database_name'),
        db_host=config.get('mongo_host'),
        db_port=config.get('mongo_port'),
        db_user=config.get('mongo_user'),
        db_pwd=config.get('mongo_pwd'),
        redis_database=config.get('redis_database')
    )


def DbSessionContext(config):
    return _DbSessionContext(
        config.get('mongo_database_name'),
        db_host=config.get('mongo_host'),
        db_port=config.get('mongo_port'),
        db_user=config.get('mongo_user'),
        db_pwd=config.get('mongo_pwd')
    )


def generate_token(n):
    return binascii.hexlify(os.urandom(n)).decode('utf')


def convert_tz_datetime(datetime_input, to_tz):
    return datetime_input.astimezone(tz.gettz(to_tz))


def utcnow():
    return datetime.now(tz=pytz.utc)


class SafeStringField(StringField):

    def __set__(self, instance, value):
        value = jinja2.utils.escape(value)
        self.set_value(instance, value)
