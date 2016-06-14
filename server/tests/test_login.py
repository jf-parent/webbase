def test_login_empty_post(client):
    response = client.post_json('/api/login')
    assert response.status_code == 200
    assert response.json == {
        'success': False,
        'error': 'InvalidRequestException'
    }


def test_login_without_token(client):
    response = client.post_json(
        '/api/login',
        {'email': 'test@test.com', 'password': '123456'}
    )
    assert response.status_code == 200
    assert response.json == {'success': False, 'error': 'CSRFMismatch'}


def test_login_with_wrong_token(client):
    response = client.post_json(
        '/api/login',
        {'email': 'test@test.com', 'password': '123456', 'token': '1337'}
    )
    assert response.status_code == 200
    assert response.json == {'success': False, 'error': 'CSRFMismatch'}


def test_login_with_disabled_user(client):
    response = client.post_json(
        '/api/login',
        {
            'email': 'disabled@disabled.com',
            'password': '123456',
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'WrongEmailOrPasswordException'


def test_login_with_empty_email_and_password(client):
    response = client.post_json(
        '/api/login',
        {
            'email': '',
            'password': '',
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'WrongEmailOrPasswordException'


def test_login_with_empty_password(client):
    response = client.post_json(
        '/api/login',
        {
            'email': '',
            'password': '123456',
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'WrongEmailOrPasswordException'


def test_login_with_empty_email(client):
    response = client.post_json(
        '/api/login',
        {
            'email': '',
            'password': '123456',
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'WrongEmailOrPasswordException'


def test_login_with_invalid_email(client):
    response = client.post_json(
        '/api/login',
        {
            'email': 'invalid',
            'password': '123456',
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'WrongEmailOrPasswordException'


def test_login_with_wrong_email(client):
    response = client.post_json(
        '/api/login',
        {
            'email': 'non-existing@non-existing.com',
            'password': '123456',
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'WrongEmailOrPasswordException'


def test_login_with_wrong_password(client):
    response = client.post_json(
        '/api/login',
        {
            'email': 'test@test.com',
            'password': '111111',
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'WrongEmailOrPasswordException'


def test_login_with_right_token(client):
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


def test_login_return_correct_user(client):
    email = 'test@test.com'
    name = 'test'
    response = client.post_json(
        '/api/login',
        {'email': email, 'password': '123456', 'token': client.__token__}
    )
    assert response.status_code == 200
    assert response.json['success']
    assert response.json['user']['email'] == email
    assert response.json['user']['name'] == name
