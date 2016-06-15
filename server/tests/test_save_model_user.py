from server.settings import config
from server.utils import DbSessionContext
from server.model.user import User


def test_save_model_not_authorized(client):
    response = client.post_json(
        '/api/save_model',
        {
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'NotAuthorizedException'


def test_save_model_invalid_request(client):
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
        '/api/save_model',
        {
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'


def test_save_model_invalid_model(client):
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
        '/api/save_model',
        {
            'token': client.__token__,
            'model': 'invalid'
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'


def test_save_model_invalid_request_missing_data(client):
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
        '/api/save_model',
        {
            'token': client.__token__,
            'model': 'user'
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'


def test_save_model_normal_user_not_authorized(client):
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

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        admin = session.query(User) \
            .filter(User.email == 'admin@admin.com').one()

    response = client.post_json(
        '/api/save_model',
        {
            'token': client.__token__,
            'model': 'user',
            'data': {
                'uid': admin.get_uid(),
                'name': 'new_name'
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'NotAuthorizedException'


def test_save_model_admin_edit_other_user(client):
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

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()

    response = client.post_json(
        '/api/save_model',
        {
            'token': client.__token__,
            'model': 'user',
            'data': {
                'uid': user.get_uid(),
                'name': 'new_name'
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()
        assert user.name == 'new_name'


def test_save_model_edit_email(client):
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

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()

    response = client.post_json(
        '/api/save_model',
        {
            'token': client.__token__,
            'model': 'user',
            'data': {
                'uid': user.get_uid(),
                'name': 'new_name',
                'email': 'newemail@newemail.com'
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user_query = session.query(User) \
            .filter(User.email == 'newemail@newemail.com')
        assert user_query.count()

        user = user_query.one()

        assert user.name == 'new_name'
        assert not user.email_confirmed


def test_save_model_invalid_data(client):
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

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()

    # INVALID EMAIL
    response = client.post_json(
        '/api/save_model',
        {
            'token': client.__token__,
            'model': 'user',
            'data': {
                'uid': user.get_uid(),
                'email': 'invalid'
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidEmailException'

    # INVALID NAME
    response = client.post_json(
        '/api/save_model',
        {
            'token': client.__token__,
            'model': 'user',
            'data': {
                'uid': user.get_uid(),
                'name': 'i',
                'email': 'test@test.com'
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidNameException'


def test_save_model_sanitize_data(client):
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

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()

    # CHANGING ROLE IS NOT ALLOWED FOR NORMAL USER
    response = client.post_json(
        '/api/save_model',
        {
            'token': client.__token__,
            'model': 'user',
            'data': {
                'uid': user.get_uid(),
                'role': 'admin'
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()
        assert user.role == 'user'


def test_save_model_edit_name_with_same_email(client):
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

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()

    response = client.post_json(
        '/api/save_model',
        {
            'token': client.__token__,
            'model': 'user',
            'data': {
                'uid': user.get_uid(),
                'name': 'new_name',
                'email': 'test@test.com'
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()
        assert user.name == 'new_name'


def test_save_model_sanitize_data_admin(client):
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

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()

    # CHANGING ROLE IS ALLOWED FOR ADMIN
    response = client.post_json(
        '/api/save_model',
        {
            'token': client.__token__,
            'model': 'user',
            'data': {
                'uid': user.get_uid(),
                'role': 'admin'
            }
        }
    )
    assert response.status_code == 200
    assert response.json['success']

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()
        assert user.role == 'admin'


def test_save_model_new_password_success(client):
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

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()

    response = client.post_json(
        '/api/save_model',
        {
            'token': client.__token__,
            'model': 'user',
            'data': {
                'uid': user.get_uid(),
                'old_password': '123456',
                'new_password': '1asdf!!'
            }
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

    response = client.post_json(
        '/api/login',
        {
            'email': 'test@test.com',
            'password': '123456',
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']

    response = client.post_json(
        '/api/login',
        {
            'email': 'test@test.com',
            'password': '1asdf!!',
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert response.json['success']


def test_save_model_new_password_invalid(client):
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

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()

    response = client.post_json(
        '/api/save_model',
        {
            'token': client.__token__,
            'model': 'user',
            'data': {
                'uid': user.get_uid(),
                'old_password': '123456',
                'new_password': '1'
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidPasswordException'


def test_save_model_new_password_old_password_incorrect(client):
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

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()

    response = client.post_json(
        '/api/save_model',
        {
            'token': client.__token__,
            'model': 'user',
            'data': {
                'uid': user.get_uid(),
                'old_password': '1111111',
                'new_password': '1asdf!!'
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'WrongEmailOrPasswordException'


def test_save_model_new_password_missing_old_password(client):
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

    with DbSessionContext(config.get('MONGO_DATABASE_NAME')) as session:
        user = session.query(User) \
            .filter(User.email == 'test@test.com').one()

    response = client.post_json(
        '/api/save_model',
        {
            'token': client.__token__,
            'model': 'user',
            'data': {
                'uid': user.get_uid(),
                'new_password': '1asdf!!'
            }
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'
