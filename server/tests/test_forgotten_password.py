def test_reset_password_not_authorized(client):
    response = client.post_json(
        '/api/reset_password',
        {
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'NotAuthorizedException'


def test_send_reset_password_token_invalid_request(client):
    response = client.post_json(
        '/api/send_reset_password_token',
        {
            'token': client.__token__
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'


def test_send_reset_password_token_success(client):
    response = client.post_json(
        '/api/send_reset_password_token',
        {
            'token': client.__token__,
            'email': 'test@test.com'
        }
    )

    assert response.status_code == 200
    assert response.json['success']


def test_send_reset_password_token_error_disabled_user(client):
    response = client.post_json(
        '/api/send_reset_password_token',
        {
            'token': client.__token__,
            'email': 'disabled@disabled.com'
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'EmailNotFound'


def test_send_reset_password_token_error_not_existing_email(client):
    response = client.post_json(
        '/api/send_reset_password_token',
        {
            'token': client.__token__,
            'email': 'i.dont.exist@devnull.com'
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'EmailNotFound'


def test_validate_reset_password_token_success(client):
    response = client.post_json(
        '/api/send_reset_password_token',
        {
            'token': client.__token__,
            'email': 'test@test.com'
        }
    )

    assert response.status_code == 200
    assert response.json['success']

    reset_password_token = response.json['reset_password_token']

    response = client.post_json(
        '/api/validate_reset_password_token',
        {
            'token': client.__token__,
            'reset_password_token': reset_password_token
        }
    )

    assert response.status_code == 200
    assert response.json['success']


def test_validate_reset_password_token_invalid_request(client):
    response = client.post_json(
        '/api/send_reset_password_token',
        {
            'token': client.__token__,
            'email': 'test@test.com'
        }
    )

    assert response.status_code == 200
    assert response.json['success']

    response = client.post_json(
        '/api/validate_reset_password_token',
        {
            'token': client.__token__
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'


def test_validate_reset_password_token_error(client):
    response = client.post_json(
        '/api/validate_reset_password_token',
        {
            'token': client.__token__,
            'reset_password_token': '1337'
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'ResetPasswordTokenInvalidException'


def test_reset_password_token_success(client):
    email = 'test@test.com'

    response = client.post_json(
        '/api/send_reset_password_token',
        {
            'token': client.__token__,
            'email': email
        }
    )

    assert response.status_code == 200
    assert response.json['success']

    reset_password_token = response.json['reset_password_token']

    response = client.post_json(
        '/api/validate_reset_password_token',
        {
            'token': client.__token__,
            'reset_password_token': reset_password_token
        }
    )

    assert response.status_code == 200
    assert response.json['success']
    assert response.json['user']['email'] == email

    response = client.post_json(
        '/api/reset_password',
        {
            'token': client.__token__,
            'password': '1asdf!!',
            'reset_password_token': reset_password_token
        }
    )

    assert response.status_code == 200
    assert response.json['success']

    # LOGIN
    response = client.post_json(
        '/api/login',
        {
            'email': email,
            'password': '1asdf!!',
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert response.json['success']
    assert response.json['user']['email'] == email


def test_reset_password_token_invalid_password(client):
    email = 'test@test.com'

    response = client.post_json(
        '/api/send_reset_password_token',
        {
            'token': client.__token__,
            'email': email
        }
    )

    assert response.status_code == 200
    assert response.json['success']

    reset_password_token = response.json['reset_password_token']

    response = client.post_json(
        '/api/validate_reset_password_token',
        {
            'token': client.__token__,
            'reset_password_token': reset_password_token
        }
    )

    assert response.status_code == 200
    assert response.json['success']
    assert response.json['user']['email'] == email

    response = client.post_json(
        '/api/reset_password',
        {
            'token': client.__token__,
            'password': '1',
            'reset_password_token': reset_password_token
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidPasswordException'


def test_reset_password_token_error(client):
    email = 'test@test.com'

    response = client.post_json(
        '/api/send_reset_password_token',
        {
            'token': client.__token__,
            'email': email
        }
    )

    assert response.status_code == 200
    assert response.json['success']

    reset_password_token = response.json['reset_password_token']

    response = client.post_json(
        '/api/validate_reset_password_token',
        {
            'token': client.__token__,
            'reset_password_token': reset_password_token
        }
    )

    assert response.status_code == 200
    assert response.json['success']
    assert response.json['user']['email'] == email

    response = client.post_json(
        '/api/reset_password',
        {
            'token': client.__token__,
            'password': '1asdf!!',
            'reset_password_token': '1337'
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'ResetPasswordTokenInvalidException'


def test_reset_password_token_invalid_request(client):
    email = 'test@test.com'

    response = client.post_json(
        '/api/send_reset_password_token',
        {
            'token': client.__token__,
            'email': email
        }
    )

    assert response.status_code == 200
    assert response.json['success']

    reset_password_token = response.json['reset_password_token']

    response = client.post_json(
        '/api/validate_reset_password_token',
        {
            'token': client.__token__,
            'reset_password_token': reset_password_token
        }
    )

    assert response.status_code == 200
    assert response.json['success']
    assert response.json['user']['email'] == email

    response = client.post_json(
        '/api/reset_password',
        {
            'token': client.__token__,
            'password': '1asdf!!'
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'

    response = client.post_json(
        '/api/reset_password',
        {
            'token': client.__token__
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'
