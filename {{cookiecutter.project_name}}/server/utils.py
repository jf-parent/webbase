from datetime import datetime
import os
import binascii
from dateutil import tz
import pytz

import jinja2
{%- if cookiecutter.database == 'mongodb' %}
from mongoalchemy.fields import StringField
{%- else %}
import sqlalchemy.types as types
{%- endif %}

from server.database import (
    _get_session,
    _get_client,
    _DbSessionContext,
    _drop_database
)


def get_session(config):
    return _get_session(
        config.get('db_name'),
        db_host=config.get('db_host'),
        db_port=config.get('db_port'),
        db_user=config.get('db_user'),
        db_pwd=config.get('db_pwd')
    )


def get_client(config):
    return _get_client(
        db_host=config.get('db_host'),
        db_port=config.get('db_port'),
        db_user=config.get('db_user'),
        db_pwd=config.get('db_pwd')
    )


def drop_database(config):
    return _drop_database(
        config.get('db_name'),
        db_host=config.get('db_host'),
        db_port=config.get('db_port'),
        db_user=config.get('db_user'),
        db_pwd=config.get('db_pwd'),
        redis_database=config.get('redis_database')
    )


def DbSessionContext(config):
    return _DbSessionContext(
        config.get('db_name'),
        db_host=config.get('db_host'),
        db_port=config.get('db_port'),
        db_user=config.get('db_user'),
        db_pwd=config.get('db_pwd')
    )


def generate_token(n):
    return binascii.hexlify(os.urandom(n)).decode('utf')


def convert_tz_datetime(datetime_input, to_tz):
    return datetime_input.astimezone(tz.gettz(to_tz))


def utcnow():
    return datetime.now(tz=pytz.utc)


{%- if cookiecutter.database == 'mongodb' %}
class SafeStringField(StringField):

    def __set__(self, instance, value):
        value = jinja2.utils.escape(value)
        self.set_value(instance, value)
{%- else %}


class SafeStringField(types.TypeDecorator):
    impl = types.String

    def process_bind_param(self, value, dialect):
        cleaned_value = jinja2.utils.escape(value)
        return cleaned_value
{%- endif %}
