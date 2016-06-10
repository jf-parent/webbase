

def test_public_api_authorized(client):
    response = client.get('/api/get_session')
    assert response.status_code == 200
    assert response.json['token']


def test_require_login_api_authorized(client):
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
        '/api/logout',
        {
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert response.json['success']


def test_require_login_api_not_authorized(client):
    response = client.post_json(
        '/api/logout',
        {
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json == \
        {'success': False, 'error': 'NotAuthorizedException'}


def test_require_admin_api_authorized(client):
    response = client.post_json(
        '/api/login',
        {
            'email': 'admin@admin.com',
            'password': '123456',
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert response.json['success']

    response = client.get('/api/admin')
    assert response.status_code == 200
    assert response.json['success']


def test_require_admin_api_not_authorized(client):
    response = client.get('/api/admin')
    assert response.status_code == 200
    assert response.json == \
        {'success': False, 'error': 'NotAuthorizedException'}

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

    response = client.get('/api/admin')
    assert response.status_code == 200
    assert response.json == \
        {'success': False, 'error': 'NotAuthorizedException'}


def test_post_without_token(client):
    response = client.post_json(
        '/api/login',
        {'email': 'test@test.com', 'password': '123456'}
    )
    assert response.status_code == 200
    assert response.json == {'success': False, 'error': 'CSRFMismatch'}


def test_post_with_wrong_token(client):
    response = client.post_json(
        '/api/login',
        {'email': 'test@test.com', 'password': '123456', 'token': '1337'}
    )
    assert response.status_code == 200
    assert response.json == {'success': False, 'error': 'CSRFMismatch'}


def test_post_with_right_token(client):
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
