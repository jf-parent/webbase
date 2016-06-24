from mongoalchemy.session import Session

from webbaseserver.settings import config
from webbaseserver.prometheus_instruments import (
    db_session_gauge,
    db_session_counter
)

async def db_handler(app, handler):
    async def middleware(request):
        if request.path.startswith('/api/'):
            db_session_gauge.inc()
            db_session_counter.inc()
            request.db_session = Session.connect(
                config.get("MONGO_DATABASE_NAME")
            )

        response = await handler(request)
        return response

    return middleware
