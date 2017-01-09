from server.settings import config
from server.utils import get_session

async def db_handler(app, handler):
    async def middleware(request):
        if request.path.startswith('/api/'):
            request.db_session = get_session(config)

        response = await handler(request)
        return response

    return middleware
