from mongoalchemy.session import Session
from server.settings import config


async def db_handler(app, handler):
    async def middleware(request):
        if request.path.startswith('/api/'):
            request.db_session = Session.connect(
                config.get("MONGO_DATABASE_NAME")
            )
            response = await handler(request)
            return response
        else:
            response = await handler(request)
            return response

    return middleware
