#! /usr/bin/env python

import os
import sys

from IPython import embed
from mongoalchemy.session import Session

HERE = os.path.abspath(os.path.dirname(__file__))
ROOT = os.path.join(HERE, '..')
sys.path.append(ROOT)

from server.model.user import User  # noqa
from server.model.notification import Notification  # noqa
from server.settings import config  # noqa

config.configure()

session = Session.connect(config.get("mongo_database_name"))

embed()
