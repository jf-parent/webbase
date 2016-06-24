#! /usr/bin/env python

import json

from IPython import embed
from mongoalchemy.session import Session

from webbaseserver.model.user import User
from webbaseserver.model.notification import Notification
from webbaseserver.settings import config

config.configure()

session = Session.connect(config.get("MONGO_DATABASE_NAME"))

q_user = session.query(User)

print('[*] q_user')

q_notification = session.query(Notification)

print('[*] q_notification')

embed()
