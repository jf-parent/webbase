import sys

sys.path.append('.')

from server.routes import routes
from server.middlewares import db_handler
from server.settings import config, logger, HERE, ROOT
from server.auth import DBAuthorizationPolicy
