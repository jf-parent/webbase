###############################################################################
# XSS
###############################################################################


def test_create_user_name_xss(client):
    SAFE_NAME = "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
    XSS_NAME = "<script>alert('xss')</script>"
    response = client.post_json(
        '/api/register',
        {
            'email': 'test.security@secure.test.com',
            'name': XSS_NAME,
            'password': '123456',
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert response.json['user']['email'] == 'test.security@secure.test.com'
    assert response.json['user']['name'] == SAFE_NAME


###############################################################################
# AUTHORIZATION
###############################################################################


def test_require_login_api_authorized(client):
    client.login('test@test.com')

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
    client.login('admin@admin.com')

    response = client.get('/api/admin')
    assert response.status_code == 200
    assert response.json['success']


def test_require_admin_api_not_authorized(client):
    response = client.get('/api/admin')
    assert response.status_code == 200
    assert response.json == \
        {'success': False, 'error': 'NotAuthorizedException'}

    client.login('test@test.com')

    response = client.get('/api/admin')
    assert response.status_code == 200
    assert response.json == \
        {'success': False, 'error': 'NotAuthorizedException'}


###############################################################################
# CSRF TOKEN
###############################################################################


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
