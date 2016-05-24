from server.auth.user import User


def permits(request, session, permission):
    if permission == 'login':
        return session.get('email', False)

    if permission == 'admin':
        email = session.get('email')
        if not email:
            return False

        user = request.db_session.query(User).filter(User.email == email).one()
        if user.role == 'admin':
            return True
        else:
            return False
