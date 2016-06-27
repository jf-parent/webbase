
from contextlib import ContextDecorator
import os
import binascii

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
            mongo_database_name
        )

    def __enter__(self):
        return self.session

    def __exit__(self, *exc):
        self.session.end()
        self.session.db.connection.disconnect()
        return False


def drop_database(db_name):
    mongo_client = MongoClient()
    db = getattr(mongo_client, db_name)
    db.connection.drop_database(db_name)

    redis_client = StrictRedis()
    redis_client.flushall()


class SafeStringField(StringField):

    def __set__(self, instance, value):
        value = jinja2.utils.escape(value)
        self.set_value(instance, value)
