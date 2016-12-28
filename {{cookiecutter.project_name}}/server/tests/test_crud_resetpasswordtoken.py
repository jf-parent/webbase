from datetime import datetime

from server.settings import config
from server.utils import DbSessionContext
from server.model.user import User
from server.model.resetpasswordtoken import Resetpasswordtoken

###############################################################################
# CREATE
###############################################################################


def test_crud_create_not_allowed_for_normal_user(client):
    client.login('test@test.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'create',
                'model': 'resetpasswordtoken',
                'data': {
                    'token': 'whatever'
                }
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'NotAuthorizedException'


def test_crud_create_missing_data(client):
    client.login('admin@admin.com')

    # Missing user_uid
    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'create',
                'model': 'resetpasswordtoken',
                'data': {
                }
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'


def test_crud_create_invalid_data(client):
    client.login('admin@admin.com')

    # Invalid name
    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'create',
                'model': 'resetpasswordtoken',
                'data': {
                    'user_uid': 'invalid',
                }
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'ServerSideError'


def test_crud_create_success(client):
    admin = client.login('admin@admin.com')

    NOW = datetime.now().isoformat()

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'create',
                'model': 'resetpasswordtoken',
                'data': {
                    'user_uid': admin.get_uid(),
                    'expiration_datetime': NOW,
                    'used': True
                }
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']

###############################################################################
# READ
###############################################################################


def test_crud_read_not_allowed_for_normal_user(client):
    client.login('test@test.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'read',
                'model': 'resetpasswordtoken'
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'NotAuthorizedException'


def test_crud_read_specific_user_with_admin(client):
    client.login('admin@admin.com')

    with DbSessionContext(config.get('mongo_database_name')) as session:
        user = session.query(User) \
                .filter(User.email == 'test@test.com').one()

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'read',
                'model': 'resetpasswordtoken',
                'filters': {
                    'user_uid': user.get_uid()
                }
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert len(response.json['results']) == 1
    assert response.json['results'][0]['user_uid'] == user.get_uid()


def test_crud_read_skip_and_limit_admin(client):
    client.login('admin@admin.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'read',
                'model': 'resetpasswordtoken',
                'limit': 2,
                'skip': 3
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert len(response.json['results']) == 1


def test_crud_read_limit_admin(client):
    client.login('admin@admin.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'read',
                'model': 'resetpasswordtoken',
                'limit': 2
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert len(response.json['results']) == 2


def test_crud_read_skip_admin(client):
    client.login('admin@admin.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'read',
                'model': 'resetpasswordtoken',
                'skip': 2
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert len(response.json['results']) == 2


def test_crud_read_admin(client):
    client.login('admin@admin.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'read',
                'model': 'resetpasswordtoken',
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert len(response.json['results']) == 4


###############################################################################
# UPDATE
###############################################################################


def test_crud_update_normal_user_not_authorized(client):
    client.login('test@test.com')

    with DbSessionContext(config.get('mongo_database_name')) as session:
        admin = session.query(User) \
            .filter(User.email == 'admin@admin.com').one()

        token = session.query(Resetpasswordtoken) \
            .filter(Resetpasswordtoken.user_uid == admin.get_uid()).one()

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'update',
                'model': 'resetpasswordtoken',
                'uid': token.get_uid(),
                'data': {
                    'name': 'new_name'
                }
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'NotAuthorizedException'


def test_crud_update_admin_other_user(client):
    client.login('admin@admin.com')

    with DbSessionContext(config.get('mongo_database_name')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()

        token = session.query(Resetpasswordtoken) \
            .filter(Resetpasswordtoken.user_uid == user.get_uid()).one()

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'update',
                'model': 'resetpasswordtoken',
                'uid': token.get_uid(),
                'data': {
                    'token': 'whatever'
                }
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert response.json['results'][0]['token'] == 'whatever'

    with DbSessionContext(config.get('mongo_database_name')) as session:
        assert session.query(Resetpasswordtoken) \
            .filter(Resetpasswordtoken.token == 'whatever').one()


###############################################################################
# DELETE
###############################################################################


def test_crud_delete_not_allowed_for_normal_user(client):
    user = client.login('test@test.com')

    with DbSessionContext(config.get('mongo_database_name')) as session:
        token = session.query(Resetpasswordtoken) \
            .filter(Resetpasswordtoken.user_uid == user.get_uid()).one()

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'delete',
                'model': 'resetpasswordtoken',
                'uid': token.get_uid()
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'NotAuthorizedException'


def test_crud_delete_admin_success(client):
    client.login('admin@admin.com')

    with DbSessionContext(config.get('mongo_database_name')) as session:
        user = session.query(User) \
                .filter(User.email == 'test@test.com').one()
        token = session.query(Resetpasswordtoken) \
            .filter(Resetpasswordtoken.user_uid == user.get_uid()).one()

    token_uid = token.get_uid()

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'delete',
                'model': 'resetpasswordtoken',
                'uid': token_uid
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert response.json['total'] == 1

    with DbSessionContext(config.get('mongo_database_name')) as session:
        assert not session.query(Resetpasswordtoken) \
                .filter(Resetpasswordtoken.mongo_id == token_uid).count()
