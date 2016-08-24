import logging
from logging.handlers import TimedRotatingFileHandler
import os
import json

HERE = os.path.abspath(os.path.dirname(__file__))
ROOT = os.path.join(HERE, '..')
logger = logging.getLogger('server')


class Config(object):
    """
    Hold a config and initialize the appropriate logger
    """

    def __init__(self):
        self.__config__ = None

    def configure(self, config=None):
        def configure_from_relative_path(path):
            config_path = os.path.join(ROOT, 'configs', path)

            with open(config_path) as fd:
                self.__config__ = json.load(fd)

            logger.setLevel(getattr(logging, self.get('log_level', 'INFO')))

            formatter = logging.Formatter(
                '[L:%(lineno)d]# %(levelname)-8s [%(asctime)s]  %(message)s',
                datefmt='%d-%m-%Y %H:%M:%S'
            )

            # StreamHandler
            sh = logging.StreamHandler()
            sh.setFormatter(formatter)
            logger.addHandler(sh)

            # FileHandler
            fh = TimedRotatingFileHandler(
                os.path.join(ROOT, 'logs', 'server.log'),
                when="midnight"
            )
            fh.setFormatter(formatter)
            logger.addHandler(fh)

        if isinstance(config, dict):
            self.__config__ = config
        elif isinstance(config, str):
            configure_from_relative_path(config)
        else:
            configure_from_relative_path('server.json')

    def __repr__(self):
        return self.__config__.__repr__()

    def get(self, key, default=None):
        if not self.__config__:
            raise Exception('Run configure() before accessing attributes')

        return self.__config__.get(key, default)

global config
config = Config()
