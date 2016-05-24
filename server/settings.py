import logging
from logging.handlers import TimedRotatingFileHandler
import os
import json

HERE = os.path.abspath(os.path.dirname(__file__))
ROOT = os.path.join(HERE, '..')
config_path = os.path.join(ROOT, 'configs', 'server.json')

with open(config_path) as fd:
    config = json.load(fd)

logger = logging.getLogger('server')
logger.setLevel(getattr(logging, config.get('LOG_LEVEL', 'INFO')))

formatter = logging.Formatter('[L:%(lineno)d]# %(levelname)-8s [%(asctime)s]  %(message)s', datefmt = '%d-%m-%Y %H:%M:%S')

#StreamHandler
sh = logging.StreamHandler()
sh.setFormatter(formatter)
logger.addHandler(sh)

#FileHandler
fh = TimedRotatingFileHandler(os.path.join(ROOT, 'logs', 'server.log'), when="midnight")
fh.setFormatter(formatter)
logger.addHandler(fh)
