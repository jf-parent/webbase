#! /usr/bin/env python

import json
import sys
import os

sys.path.append('.')

from IPython import embed
from mongoalchemy.session import Session

from server.auth.user import User
from server.settings import config

session = Session.connect(config.get("MONGO_DATABASE_NAME"))

q_user = session.query(User)

print('[*] q_user')

embed()
