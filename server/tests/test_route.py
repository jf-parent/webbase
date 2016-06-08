import pytest
from webtest.app import AppError

from server.exceptions import *  # noqa


def test_index_route(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.content_type == 'text/html'


def test_index_non_api_route(client):
    response = client.get('/kdjfkdjfdflkdjflk/kdjfkdjf/kdjfk')
    assert response.status_code == 200
    assert response.content_type == 'text/html'


def test_api(client):
    response = client.get('/api/get_session')
    assert response.status_code == 200
    assert response.content_type == 'application/json'


def test_non_existing_api_route(client):
    with pytest.raises(AppError) as error_404:
        client.get('/api/non_existing')

    assert error_404


def test_get_session_route(client):
    response = client.get('/api/get_session')

    assert response.status_code == 200
    assert response.content_type == 'application/json'


def test_logout_route(client):
    response = client.post('/api/logout')

    assert response.status_code == 200
    assert response.content_type == 'application/json'


def test_register_route(client):
    response = client.post('/api/register')

    assert response.status_code == 200
    assert response.content_type == 'application/json'


def test_login_route(client):
    response = client.post('/api/login')

    assert response.status_code == 200
    assert response.content_type == 'application/json'


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


def test_register_method_not_allowed(client):
    with pytest.raises(AppError) as get_not_allowed:
        client.get('/api/register')

    assert get_not_allowed

    with pytest.raises(AppError) as put_not_allowed:
        client.put('/api/register')

    assert put_not_allowed

    with pytest.raises(AppError) as delete_not_allowed:
        client.delete('/api/register')

    assert delete_not_allowed


def test_logout_method_not_allowed(client):
    with pytest.raises(AppError) as get_not_allowed:
        client.get('/api/logout')

    assert get_not_allowed

    with pytest.raises(AppError) as put_not_allowed:
        client.put('/api/logout')

    assert put_not_allowed

    with pytest.raises(AppError) as delete_not_allowed:
        client.delete('/api/logout')

    assert delete_not_allowed


def test_get_session_method_not_allowed(client):
    with pytest.raises(AppError) as post_not_allowed:
        client.post('/api/get_session')

    assert post_not_allowed

    with pytest.raises(AppError) as put_not_allowed:
        client.put('/api/get_session')

    assert put_not_allowed

    with pytest.raises(AppError) as delete_not_allowed:
        client.delete('/api/get_session')

    assert delete_not_allowed
