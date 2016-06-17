from server.settings import config
from server.utils import DbSessionContext
from server.model.user import User
from server.model.email_confirmation_token import EmailConfirmationToken


def test_confirm_email_not_authorized(client):
    response = client.post_json(
        '/api/confirm_email',
        {
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'NotAuthorizedException'


def test_confirm_email_invalid_request(client):
    # LOGIN
    response = client.post_json(
        '/api/login',
        {
            'email': 'test@test.com',
            'password': '123456',
            'token': client.__token__
        }
    )

    assert response.status_code == 200
    assert response.json['success']

    response = client.post_json('/api/confirm_email')

    assert response.status_code == 200
    assert not response.json['success']


def test_confirm_email_right_token(client):
    # LOGIN
    response = client.post_json(
        '/api/login',
        {
            'email': 'test@test.com',
            'password': '123456',
            'token': client.__token__
        }
    )

    assert response.status_code == 200
    assert response.json['success']

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User).filter(User.email == 'test@test.com').one()
        token = session.query(EmailConfirmationToken)\
            .filter(EmailConfirmationToken.user_id == user.get_uid()).one()

    response = client.post_json(
        '/api/confirm_email',
        {
            'token': token.token
        }
    )

    assert response.status_code == 200
    assert response.json['success']
    assert response.json['user']['email'] == 'test@test.com'


def test_confirm_email_wrong_token(client):
    # LOGIN
    response = client.post_json(
        '/api/login',
        {
            'email': 'test@test.com',
            'password': '123456',
            'token': client.__token__
        }
    )

    assert response.status_code == 200
    assert response.json['success']

    response = client.post_json(
        '/api/confirm_email',
        {
            'token': '123456kdjfkdjf'
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'TokenInvalidException'


def test_confirm_email_right_token_wrong_user(client):
    # LOGIN
    response = client.post_json(
        '/api/login',
        {
            'email': 'test@test.com',
            'password': '123456',
            'token': client.__token__
        }
    )

    assert response.status_code == 200
    assert response.json['success']

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User)\
            .filter(User.email == 'admin@admin.com').one()
        token = session.query(EmailConfirmationToken)\
            .filter(EmailConfirmationToken.user_id == user.get_uid()).one()

    response = client.post_json(
        '/api/confirm_email',
        {
            'token': token.token
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'TokenViolationException'


def test_confirm_email_already_confirmed(client):
    # LOGIN
    response = client.post_json(
        '/api/login',
        {
            'email': 'test@test.com',
            'password': '123456',
            'token': client.__token__
        }
    )

    assert response.status_code == 200
    assert response.json['success']

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User).filter(User.email == 'test@test.com').one()
        token = session.query(EmailConfirmationToken)\
            .filter(EmailConfirmationToken.user_id == user.get_uid()).one()

    response = client.post_json(
        '/api/confirm_email',
        {
            'token': token.token
        }
    )

    assert response.status_code == 200
    assert response.json['success']

    response = client.post_json(
        '/api/confirm_email',
        {
            'token': token.token
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'TokenAlreadyUsedException'
