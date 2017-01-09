from contextlib import ContextDecorator
from dateutil import tz

from mongoalchemy.session import Session
from redis import StrictRedis
from pymongo import MongoClient


class _DbSessionContext(ContextDecorator):
    def __init__(
            self,
            db_name,
            db_host='127.0.0.1',
            db_port=27017,
            db_user=False,
            db_pwd=False):

        self.session = _get_session(
            db_name,
            db_host=db_host,
            db_port=db_port,
            db_user=db_user,
            db_pwd=db_pwd
        )

    def __enter__(self):
        return self.session

    def __exit__(self, *exc):
        self.session.end()
        self.session.db.client.close()
        return False


def _get_session(
        db_name,
        db_host='127.0.0.1',
        db_port=27017,
        db_user=False,
        db_pwd=False):

    client = _get_client(
        db_host=db_host,
        db_port=db_port,
        db_user=db_user,
        db_pwd=db_pwd
    )
    db = client[db_name]

    return Session(db, tz_aware=True, timezone=tz.gettz('UTC'))


def _get_client(
        db_host='127.0.0.1',
        db_port=27017,
        db_user=False,
        db_pwd=False):

    if db_user:
        return MongoClient(
            "mongodb://{db_user}:{db_pwd}@{db_host}:{db_port}"
            .format(
                db_user=db_user,
                db_pwd=db_pwd,
                db_host=db_host,
                db_port=db_port
            )
        )
    else:
        return MongoClient(host=db_host, port=db_port)


def _drop_database(
        db_name,
        db_host='127.0.0.1',
        db_port=27017,
        db_user=False,
        db_pwd=False,
        redis_database=0):

    client = _get_client(
        db_host=db_host,
        db_port=db_port,
        db_user=db_user,
        db_pwd=db_pwd
    )
    db = getattr(client, db_name)
    db.client.drop_database(db_name)

    redis_client = StrictRedis(db=redis_database)
    redis_client.flushdb()
