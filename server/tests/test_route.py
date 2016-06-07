import json

import pytest
from webtest.app import AppError

from server.exceptions import *

def test_index_root(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.content_type == 'text/html'

def test_index_other(client):
    response = client.get('/kdjfkdjfdflkdjflk/kdjfkdjf/kdjfk')
    assert response.status_code == 200
    assert response.content_type == 'text/html'

def test_api(client):
    response = client.get('/api/get_session')
    assert response.status_code == 200
    assert response.content_type == 'application/json'

def test_existing(client):
    with pytest.raises(AppError) as error_404:
        client.get('/api/non_existing')

    assert error_404

def test_admin_api(client):
    response = client.get('/api/admin')
    assert response.status_code == 200
    assert response.content_type == 'application/json'
    assert response.json == {'success': False, 'error': 'NotAuthorizedException'}

def test_login_empty_post(client):
    response = client.post('/api/login')
    assert response.status_code == 200
    assert response.content_type == 'application/json'
    assert response.json == {'success': False, 'error': 'ServerSideError'}

def test_login_no_token_post(client):
    response = client.post_json('/api/login', {'email': 'test@test.com', 'password': '123456'})
    assert response.status_code == 200
    assert response.content_type == 'application/json'
    assert response.json == {'success': False, 'error': 'ServerSideError'}

def test_login_method_not_allowed(client):
    with pytest.raises(AppError) as get_not_allowed:
        client.get('/api/login')

    assert get_not_allowed

    with pytest.raises(AppError) as put_not_allowed:
        client.put('/api/login')

    assert put_not_allowed

    with pytest.raises(AppError) as delete_not_allowed:
        client.delete('/api/login')

    assert delete_not_allowed

    """
    ('*', '/api/register', Register, 'api_register'),
    ('*', '/api/logout', Logout, 'api_logout'),
    """
