from server.settings import config
from server.utils import DbSessionContext
from server.model.user import User


def test_crud_not_authorized(client):
    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'NotAuthorizedException'


def test_crud_filters_wildcard(client):
    client.login('test@test.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'read',
                'model': 'user',
                'filters_wildcard': {
                    'email': 'test'
                }
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert response.json['results'][0]['email'] == 'test@test.com'
    assert response.json['total'] == 1


def test_crud_invalid_request_missing_actions(client):
    client.login('test@test.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'


def test_crud_invalid_model(client):
    client.login('test@test.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'read',
                'model': 'invalid'
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'ModelImportException'


def test_crud_invalid_request_missing_action(client):
    client.login('test@test.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'model': 'user'
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'


def test_crud_invalid_request_invalid_action_name(client):
    client.login('test@test.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'invalid',
                'model': 'user'
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'


def test_crud_combination_multiple_model_multiple_action_by_admin(client):
    user = client.login('admin@admin.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': [{
                'action': 'create',
                'model': 'user',
                'data': {
                    'email': 'new-test@new-test.com',
                    'name': 'New test',
                    'password': '123456'
                }
            }, {
                'action': 'read',
                'model': 'notification'
            }, {
                'action': 'update',
                'model': 'user',
                'uid': user.get_uid(),
                'data': {
                    'name': 'New admin'
                }
            }]
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert type(response.json['results']) == list
    assert response.json['results'][0]['total'] == 1
    assert response.json['results'][1]['total'] == 16
    assert len(response.json['results'][1]['results']) == 16
    assert response.json['results'][2]['results'][0]['name'] == 'New admin'
    assert response.json['results'][2]['total'] == 1


def test_crud_combination_multiple_model_multiple_action_by_user_not_allowed(client):  # noqa
    client.login('test@test.com')

    with DbSessionContext(config.get('mongo_database_name')) as session:
        admin = session.query(User) \
                .filter(User.email == 'admin@admin.com').one()

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': [{
                'action': 'create',
                'model': 'user',
                'data': {
                    'email': 'new-test@new-test.com',
                    'name': 'New test',
                    'password': '123456'
                }
            }, {
                'action': 'read',
                'model': 'notification'
            }, {
                'action': 'update',
                'model': 'user',
                'uid': admin.get_uid(),
                'data': {
                    'name': 'New admin'
                }
            }]
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert type(response.json['error']) == list
    assert len(response.json['error']) == 3
    assert response.json['error'][0] == 'NotAuthorizedException'
    assert response.json['error'][1] == 'NotAuthorizedException'
    assert response.json['error'][2] == 'NotAuthorizedException'
    assert response.json['results'][0]['error'] == 'NotAuthorizedException'
    assert response.json['results'][1]['error'] == 'NotAuthorizedException'
    assert response.json['results'][2]['error'] == 'NotAuthorizedException'


def test_crud_combination_multiple_model_multiple_action_by_user_some_allowed(client):  # noqa
    user = client.login('test@test.com')

    with DbSessionContext(config.get('mongo_database_name')) as session:
        admin = session.query(User) \
                .filter(User.email == 'admin@admin.com').one()

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': [{
                'action': 'create',
                'model': 'user',
                'data': {
                    'email': 'new-test@new-test.com',
                    'name': 'New test',
                    'password': '123456'
                }
            }, {
                'action': 'read',
                'model': 'notification',
                'filters': {
                    'user_uid': user.get_uid()
                }
            }, {
                'action': 'update',
                'model': 'user',
                'uid': admin.get_uid(),
                'data': {
                    'name': 'New admin'
                }
            }]
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert type(response.json['error']) == list
    assert len(response.json['error']) == 2
    assert response.json['error'][0] == 'NotAuthorizedException'
    assert response.json['error'][1] == 'NotAuthorizedException'
    assert response.json['results'][0]['error'] == 'NotAuthorizedException'
    assert response.json['results'][1]['total'] == 4
    assert response.json['results'][2]['error'] == 'NotAuthorizedException'


def test_crud_combination_total_only(client):
    client.login('admin@admin.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': [{
                'action': 'read',
                'model': 'user',
                'total_only': True
            }, {
                'action': 'read',
                'model': 'notification',
                'total_only': True
            }]
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert type(response.json['results']) == list
    assert response.json['results'][0]['total'] == 4
    assert response.json['results'][1]['total'] == 16
    assert not response.json['results'][0]['results']
    assert not response.json['results'][1]['results']
