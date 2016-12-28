from contextlib import ContextDecorator
from datetime import datetime
import os
import binascii
from dateutil import tz
import pytz

from redis import StrictRedis
import jinja2
from pymongo import MongoClient
from mongoalchemy.session import Session
from mongoalchemy.fields import StringField


def generate_token(n):
    return binascii.hexlify(os.urandom(n)).decode('utf')


class DbSessionContext(ContextDecorator):
    def __init__(self, mongo_database_name):
        self.session = Session.connect(
            mongo_database_name,
            timezone=tz.gettz('UTC')
        )

    def __enter__(self):
        return self.session

    def __exit__(self, *exc):
        self.session.end()
        self.session.db.client.close()
        return False


def convert_tz_datetime(datetime_input, to_tz):
    return datetime_input.astimezone(tz.gettz(to_tz))


def utcnow():
    return datetime.now(tz=pytz.utc)


def drop_database(db_name, redis_database=0):
    mongo_client = MongoClient()
    db = getattr(mongo_client, db_name)
    db.client.drop_database(db_name)

    redis_client = StrictRedis(db=redis_database)
    redis_client.flushdb()


class SafeStringField(StringField):

    def __set__(self, instance, value):
        value = jinja2.utils.escape(value)
        self.set_value(instance, value)
