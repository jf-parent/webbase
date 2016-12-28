from mock import patch, MagicMock
from pytest import set_trace  # noqa

from server.model.user import User
from server.settings import config
from server.utils import DbSessionContext


class AsyncMock(MagicMock):
    async def __call__(self, *args, **kwargs):
        return super(AsyncMock, self).__call__(*args, **kwargs)


@patch.object(User, 'after_create', new_callable=AsyncMock)
@patch.object(User, 'after_delete', new_callable=AsyncMock)
def test_mocking(adm, acm, client):
    client.login('admin@admin.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'create',
                'model': 'user',
                'data': {
                    'name': 'test',
                    'email': 'test-1@test-1.com',
                    'password': '123456'
                }
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert acm.called
    assert not adm.called


@patch.object(User, 'after_create', new_callable=AsyncMock)
@patch.object(User, 'before_create', new_callable=AsyncMock)
def test_after_create_and_before_create_called(bcm, acm, client):
    client.login('admin@admin.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'create',
                'model': 'user',
                'data': {
                    'name': 'test',
                    'email': 'test-1@test-1.com',
                    'password': '123456'
                }
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert acm.called
    assert bcm.called


@patch.object(User, 'after_update', new_callable=AsyncMock)
@patch.object(User, 'before_update', new_callable=AsyncMock)
def test_after_update_and_before_update_called(aum, bum, client):
    user = client.login('admin@admin.com')

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'update',
                'model': 'user',
                'uid': user.get_uid(),
                'data': {
                    'name': 'new_name',
                    'email': 'newemail@newemail.com'
                }
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert aum.called
    assert bum.called


@patch.object(User, 'after_delete', new_callable=AsyncMock)
@patch.object(User, 'before_delete', new_callable=AsyncMock)
def test_after_delete_and_before_delete_called(adm, bdm, client):
    client.login('admin@admin.com')

    with DbSessionContext(config.get('mongo_database_name')) as session:
        user = session.query(User) \
                .filter(User.email == 'test@test.com').one()

    user_uid = user.get_uid()

    response = client.post_json(
        '/api/crud',
        {
            'token': client.__token__,
            'actions': {
                'action': 'delete',
                'model': 'user',
                'uid': user_uid
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert adm.called
    assert bdm.called
