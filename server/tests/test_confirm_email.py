from server.settings import config
from server.utils import DbSessionContext
from server.model.user import User
from server.model.emailconfirmationtoken import Emailconfirmationtoken
from server.model.notification import Notification


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
    client.login('test@test.com')

    response = client.post_json('/api/confirm_email')

    assert response.status_code == 200
    assert not response.json['success']


def test_confirm_email_right_token(client):
    user = client.login('test@test.com')

    with DbSessionContext(config.get('mongo_database_name')) as session:
        token = session.query(Emailconfirmationtoken)\
            .filter(Emailconfirmationtoken.user_uid == user.get_uid()).one()

    response = client.post_json(
        '/api/confirm_email',
        {
            'token': token.token
        }
    )

    assert response.status_code == 200
    assert response.json['success']
    assert response.json['user']['email'] == 'test@test.com'

    with DbSessionContext(config.get('mongo_database_name')) as session:
        last_notification = session.query(Notification)\
            .filter(Notification.user_uid == user.get_uid())\
            .descending(Notification.created_ts)\
            .first()

        assert last_notification.message == \
            'notification.YourEmailHasBeenConfirmed'


def test_confirm_email_wrong_token(client):
    client.login('test@test.com')

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
    client.login('test@test.com')

    with DbSessionContext(config.get('mongo_database_name')) as session:
        user = session.query(User)\
            .filter(User.email == 'admin@admin.com').one()
        token = session.query(Emailconfirmationtoken)\
            .filter(Emailconfirmationtoken.user_uid == user.get_uid()).one()

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
    user = client.login('test@test.com')

    with DbSessionContext(config.get('mongo_database_name')) as session:
        token = session.query(Emailconfirmationtoken)\
            .filter(Emailconfirmationtoken.user_uid == user.get_uid()).one()

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
