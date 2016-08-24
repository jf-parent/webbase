from aiohttp_session import get_session

from server.model.user import User
from server.prometheus_instruments import active_user_gauge


def permits(request, session, permission):
    # GET THE USER
    uid = session.get('uid')
    if not uid:
        return False

    user_query = request.db_session.query(User).filter(User.mongo_id == uid)
    if user_query.count():
        user = user_query.one()
        if user.enable:
            # LOGIN
            if permission == 'login':
                return True

            # ADMIN
            elif permission == 'admin':
                if user.role == 'admin':
                    return True

    # BY DEFAUlT
    return False


def get_user_from_session(session, db_session):
    try:
        return db_session.query(User)\
            .filter(User.mongo_id == session['uid']).one()
    except:
        return None


async def set_session(user, request):
    session = await get_session(request)
    session['uid'] = user.get_uid()
    active_user_gauge.inc()
