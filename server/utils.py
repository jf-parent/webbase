
from contextlib import ContextDecorator
import os
import binascii

from mongoalchemy.session import Session


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
