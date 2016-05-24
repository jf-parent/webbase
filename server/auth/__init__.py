from aiohttp_security.abc import AbstractAuthorizationPolicy

from server.settings import logger

class DBAuthorizationPolicy(AbstractAuthorizationPolicy):
    def __init__(self, dbengine):
        self.dbengine = dbengine

    async def authorized_user_id(self, identity):
        logger.debug('authorized_user_id')
        return 'test'

    async def permits(self, identity, permission, context=None):
        logger.debug('permits')
        if permission == 'login':
            return False
        return True
