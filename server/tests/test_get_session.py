from server.settings import config
from server.utils import DbSessionContext


def test_get_session_return_token(client):
    data = {'user_timezone': 'Australia/Sydney'}
    response = client.post_json('/api/get_session', data)
    assert response.json['token']
    assert response.json['token'] != 'null'


def test_get_session_with_logged_user(client):
    user = client.login('test@test.com')

    # Get session
    data = {'user_timezone': 'Australia/Sydney'}
    response = client.post_json('/api/get_session', data)
    assert response.status_code == 200
    assert response.json['success']
    assert response.json['user']['email'] == user.email
    assert response.json['user']['name'] == user.name
    assert response.status_code == 200
    assert response.json['success']


def test_get_session_with_logged_disabled_user(client):
    user = client.login('to.disable@to.disable.com')

    # Get session
    data = {'user_timezone': 'Australia/Sydney'}
    response = client.post_json('/api/get_session', data)
    assert response.status_code == 200
    assert response.json['success']
    assert response.json['user']['email'] == user.email
    assert response.json['user']['name'] == user.name
    assert response.status_code == 200
    assert response.json['success']

    # Disable user
    with DbSessionContext(config.get('mongo_database_name')) as session:
        user.enable = False
        session.update(user)

    # Get session
    data = {'user_timezone': 'Australia/Sydney'}
    response = client.post_json('/api/get_session', data)
    assert not response.json['user']
    assert response.status_code == 200
    assert not response.json['success']

    # Login
    response = client.post_json(
        '/api/login',
        {
            'email': 'to.disabled@to.disabled.com',
            'password': '123456',
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'WrongEmailOrPasswordException'
