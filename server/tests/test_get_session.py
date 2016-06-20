from server.settings import config
from server.utils import DbSessionContext


def test_get_session_return_token(client):
    response = client.get('/api/get_session')
    assert response.json['token']
    assert response.json['token'] != 'null'


def test_get_session_with_logged_user(client):
    user = client.login('test@test.com')

    # Get session
    response = client.get('/api/get_session')
    assert response.status_code == 200
    assert response.json['success']
    assert response.json['user']['email'] == user.email
    assert response.json['user']['name'] == user.name
    assert response.status_code == 200
    assert response.json['success']


def test_get_session_with_logged_disabled_user(client):
    user = client.login('to.disable@to.disable.com')

    # Get session
    response = client.get('/api/get_session')
    assert response.status_code == 200
    assert response.json['success']
    assert response.json['user']['email'] == user.email
    assert response.json['user']['name'] == user.name
    assert response.status_code == 200
    assert response.json['success']

    # Disable user
    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user.enable = False
        session.update(user)

    # Get session
    response = client.get('/api/get_session')
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
