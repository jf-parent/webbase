from mongoalchemy.session import Session

from server.settings import config

async def db_handler(app, handler):
    async def middleware(request):
        if request.path.startswith('/api/'):
            request.db_session = Session.connect(
                config.get("mongo_database_name")
            )

        response = await handler(request)
        return response

    return middleware
