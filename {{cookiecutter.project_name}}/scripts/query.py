#! /usr/bin/env python

import os
import sys

from IPython.terminal.embed import InteractiveShellEmbed

HERE = os.path.abspath(os.path.dirname(__file__))
ROOT = os.path.join(HERE, '..')
sys.path.append(ROOT)

from server.utils import get_session  # noqa
from server.model.user import User  # noqa
from server.model.notification import Notification  # noqa
from server.settings import config  # noqa

config.configure()

session = get_session(config)

ipshell = InteractiveShellEmbed()

banner = "[*] Import the model you want to query: from server.model.{model_name} import {Model}"  # noqa
ipshell(banner)
