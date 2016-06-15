from server.model.user import User


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
