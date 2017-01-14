from contextlib import ContextDecorator
{%- if cookiecutter.database == 'mongodb' %}
from dateutil import tz

from mongoalchemy.session import Session
from pymongo import MongoClient
{% else %}
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
{% endif %}
from redis import StrictRedis
{%- if cookiecutter.database == 'postgresql' %}
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
{% endif %}

{%- if cookiecutter.database == 'mongodb' %}
DEFAULT_PORT = 27017
{%- elif cookiecutter.database == 'postgresql' %}
DEFAULT_PORT = 5432
{%- endif %}

{%- if cookiecutter.database != 'mongodb' %}
Base = declarative_base()


def create_db(config):
    {%- if cookiecutter.database == 'postgresql' %}
    db_name = config.get('db_name')

    if config.get('db_user'):
        conn = psycopg2.connect(
            dbname='postgres',
            user=config.get('db_user'),
            host=config.get('db_host'),
            password=config.get('db_pwd')
        )
    else:
        conn = psycopg2.connect(
            dbname='postgres'
        )

    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

    cursor = conn.cursor()
    try:
        cursor.execute(
            'CREATE DATABASE "{db_name}";'
            .format(
                db_name=config.get('db_name')
            )
        )
    except Exception as e:
        if '"{db_name}" already exists'.format(db_name=db_name) not in str(e):
            raise
    conn.close()
    {%- endif %}


def init_db(config):
    from server.model.user import User  # noqa
    from server.model.notification import Notification  # noqa
    from server.model.emailconfirmationtoken import Emailconfirmationtoken  # noqa
    from server.model.resetpasswordtoken import Resetpasswordtoken  # noqa
    # TODO automate
    create_db(config)
    Base.metadata.create_all(
        _get_client(
            db_name=config.get('db_name'),
            db_host=config.get('db_host'),
            db_port=config.get('db_port'),
            db_user=config.get('db_user'),
            db_pwd=config.get('db_pwd')
        )
    )
{%- endif %}


def get_connection_url(config):
    {%- if cookiecutter.database != 'mongodb' %}
    db_type = '{{cookiecutter.database}}'
    {%- endif %}
    if config.get('db_user'):
        {%- if cookiecutter.database == 'mongodb' %}
        return "mongodb://{db_user}:{db_pwd}@{db_host}:{db_port}"\
            .format(
                **config
            )
        {%- else %}
        return '{db_type}://{db_user}:{db_pwd}@{db_host}:{db_port}/{db_name}'\
            .format(
                db_type=db_type,
                **config
            )
        {%- endif %}
    else:
        {%- if cookiecutter.database != 'mongodb' %}
        return '{db_type}://localhost/{db_name}'\
            .format(
                db_name=config.get('db_name'),
                db_type=db_type
            )
        {%- endif %}


class _DbSessionContext(ContextDecorator):
    def __init__(
            self,
            db_name,
            db_host='127.0.0.1',
            db_port=DEFAULT_PORT,
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
        {%- if cookiecutter.database == 'mongodb' %}
        self.session.end()
        self.session.db.client.close()
        {%- else %}
        self.session.close()
        {%- endif %}
        return False


def _get_session(
        db_name,
        db_host='127.0.0.1',
        db_port=DEFAULT_PORT,
        db_user=False,
        db_pwd=False):

    client = _get_client(
        db_host=db_host,
        db_port=db_port,
        db_user=db_user,
        db_pwd=db_pwd,
        db_name=db_name
    )
    {%- if cookiecutter.database == 'mongodb' %}
    db = client[db_name]

    return Session(db, tz_aware=True, timezone=tz.gettz('UTC'))
    {%- else %}
    Base.metadata.bind = client
    db_session = sessionmaker(bind=client)
    return db_session()
    {%- endif %}


def _get_client(
        db_host='127.0.0.1',
        db_port=DEFAULT_PORT,
        db_user=False,
        db_pwd=False,
        db_name=False):

    config = {
        'db_name': db_name,
        'db_port': db_port,
        'db_user': db_user,
        'db_pwd': db_pwd,
        'db_name': db_name
    }
    {%- if cookiecutter.database == 'mongodb' %}
    if db_user:
        return MongoClient(get_connection_url(config))
    else:
        return MongoClient(host=db_host, port=db_port)
    {%- else %}
    return create_engine(get_connection_url(config))
    {%- endif %}


def _drop_database(
        db_name,
        db_host='127.0.0.1',
        db_port=DEFAULT_PORT,
        db_user=False,
        db_pwd=False,
        redis_database=0):

    {%- if cookiecutter.database == 'mongodb' %}
    client = _get_client(
        db_name=db_name,
        db_host=db_host,
        db_port=db_port,
        db_user=db_user,
        db_pwd=db_pwd
    )
    db = getattr(client, db_name)
    db.client.drop_database(db_name)
    {%- elif cookiecutter.database == 'postgresql' %}

    if db_user:
        conn = psycopg2.connect(
            dbname='postgres',
            user=db_user,
            host=db_host,
            password=db_pwd
        )
    else:
        conn = psycopg2.connect(
            dbname='postgres'
        )

    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

    cursor = conn.cursor()
    cursor.execute("""
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '{db_name}'
          AND pid <> pg_backend_pid();
    """.format(db_name=db_name))
    cursor.execute(
        'DROP DATABASE IF EXISTS "{db_name}";'
        .format(
            db_name=db_name
        )
    )
    conn.close()
    {%- endif %}

    redis_client = StrictRedis(db=redis_database)
    redis_client.flushdb()
