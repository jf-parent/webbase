#! /usr/bin/env python

import json
import sys
import os

sys.path.append('.')

from IPython import embed
from mongoalchemy.session import Session

from server.model.user import User
from server.model.notification import Notification
from server.settings import config

config.configure()

session = Session.connect(config.get("MONGO_DATABASE_NAME"))

q_user = session.query(User)

print('[*] q_user')

q_notification = session.query(Notification)

print('[*] q_notification')

embed()
