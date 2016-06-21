from server.settings import config
from server.utils import DbSessionContext
from server.model.user import User
from server.model.notification import Notification


###############################################################################
# CREATE
###############################################################################


def test_crud_create_notification_message(client):
    user = client.login('admin@admin.com')

    response = client.post_json(
        '/api/crud/c',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': {
                'message': 'test',
                'target_url': '/profile',
                'user_uid': user.get_uid(),
                'template_data': {
                    'test': 'test'
                }
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert type(response.json['results']) == list
    assert response.json['results'][0]['message'] == 'test'
    assert response.json['results'][0]['target_url'] == '/profile'
    assert response.json['results'][0]['template_data'] == {
        'test': 'test'
    }
    assert not response.json['results'][0]['seen']
    assert len(response.json['results']) == 1


def test_crud_create_notifications(client):
    user = client.login('admin@admin.com')

    response = client.post_json(
        '/api/crud/c',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': [{
                'message': 'New test',
                'user_uid': user.get_uid()
            }, {
                'message': 'New test',
                'user_uid': user.get_uid()
            }]
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert type(response.json['results']) == list
    assert response.json['results'][0]['message'] == 'New test'
    assert response.json['results'][1]['message'] == 'New test'
    assert not response.json['results'][0]['seen']
    assert len(response.json['results']) == 2


def test_crud_create_notification_not_allowed_normal_user(client):
    user = client.login('test@test.com')

    response = client.post_json(
        '/api/crud/c',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': {
                'message': '{test}',
                'user_uid': user.get_uid()
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'NotAuthorizedException'


###############################################################################
# READ
###############################################################################

def test_crud_read_notifications(client):
    user = client.login('test@test.com')

    response = client.post_json(
        '/api/crud/r',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': {
                'filters': {
                    'user_uid': user.get_uid()
                }
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert type(response.json['results']) == list
    assert response.json['results'][0]['message'] == 'Test 1'
    assert not response.json['results'][0]['seen']
    assert response.json['results'][3]['seen']
    assert response.json['results'][3]['seen_timestamp']
    assert len(response.json['results']) == 4


def test_crud_read_specific_notification(client):
    user = client.login('test@test.com')

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        notification = session.query(Notification)\
            .filter(Notification.user_uid == user.get_uid()).first()

    response = client.post_json(
        '/api/crud/r',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': {
                'uid': notification.get_uid()
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert type(response.json['results']) == list
    assert response.json['results'][0]['message'] == 'Test 1'
    assert response.json['results'][0]['uid'] == notification.get_uid()
    assert not response.json['results'][0]['seen']
    assert len(response.json['results']) == 1


def test_crud_read_seen_notification_only(client):
    user = client.login('test@test.com')

    response = client.post_json(
        '/api/crud/r',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': {
                'filters': {
                    'user_uid': user.get_uid(),
                    'seen': True
                }
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert type(response.json['results']) == list
    assert response.json['results'][0]['message'] == 'Test 4'
    assert response.json['results'][0]['seen']
    assert len(response.json['results']) == 1


def test_crud_read_limit(client):
    user = client.login('test@test.com')

    response = client.post_json(
        '/api/crud/r',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': {
                'limit': 2,
                'filters': {
                    'user_uid': user.get_uid()
                }
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert type(response.json['results']) == list
    assert response.json['results'][0]['message'] == 'Test 1'
    assert len(response.json['results']) == 2


def test_crud_read_skip(client):
    user = client.login('test@test.com')

    response = client.post_json(
        '/api/crud/r',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': {
                'skip': 1,
                'filters': {
                    'user_uid': user.get_uid()
                }
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert type(response.json['results']) == list
    assert response.json['results'][0]['message'] == 'Test 2'
    assert len(response.json['results']) == 3


def test_crud_read_limit_and_skip(client):
    user = client.login('test@test.com')

    response = client.post_json(
        '/api/crud/r',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': {
                'skip': 1,
                'limit': 2,
                'filters': {
                    'user_uid': user.get_uid()
                }
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert type(response.json['results']) == list
    assert response.json['results'][0]['message'] == 'Test 2'
    assert len(response.json['results']) == 2


###############################################################################
# UPDATE
###############################################################################


def test_crud_update_notification_sanitize_data_for_normal_user(client):
    user = client.login('test@test.com')

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        notification = session.query(Notification)\
            .filter(Notification.user_uid == user.get_uid()).first()

    response = client.post_json(
        '/api/crud/u',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': {
                'uid': notification.get_uid(),
                'seen': True,
                'message': '{test}'
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert response.json['updated'][0]['seen']
    assert response.json['updated'][0]['message'] == 'Test 1'
    assert response.json['updated'][0]['seen_timestamp']


def test_crud_update_notification_by_admin(client):
    client.login('admin@admin.com')

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User)\
            .filter(User.email == 'test@test.com').one()
        notification = session.query(Notification)\
            .filter(Notification.user_uid == user.get_uid()).first()

    response = client.post_json(
        '/api/crud/u',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': {
                'uid': notification.get_uid(),
                'seen': True,
                'message': 'test'
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert response.json['updated'][0]['seen']
    assert response.json['updated'][0]['message'] == 'test'
    assert response.json['updated'][0]['seen_timestamp']


def test_crud_update_missing_uid(client):
    client.login('test@test.com')

    response = client.post_json(
        '/api/crud/u',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': {
                'seen': True,
                'message': 'general.errorMsg'
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'


###############################################################################
# DELETE
###############################################################################


def test_crud_delete_missing_uid(client):
    client.login('admin@admin.com')

    response = client.post_json(
        '/api/crud/d',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': {
                'message': 'general.errorMsg'
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'


def test_crud_delete_not_allowed_for_normal_user(client):
    user = client.login('test@test.com')

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        notification = session.query(Notification)\
            .filter(Notification.user_uid == user.get_uid()).first()

    response = client.post_json(
        '/api/crud/d',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': {
                'uid': notification.get_uid()
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'NotAuthorizedException'


def test_crud_delete_notification_by_admin(client):
    client.login('admin@admin.com')

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User)\
            .filter(User.email == 'test@test.com').one()
        notification = session.query(Notification)\
            .filter(Notification.user_uid == user.get_uid()).first()

    notification_uid = notification.get_uid()

    response = client.post_json(
        '/api/crud/d',
        {
            'token': client.__token__,
            'model': 'notification',
            'data': {
                'uid': notification_uid
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert response.json['deleted'][0]['uid'] == notification_uid

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        assert not session.query(Notification)\
            .filter(Notification.mongo_id == notification_uid).count()
