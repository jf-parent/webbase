def test_confirm_email_not_authorized(client):
    response = client.post_json(
        '/api/confirm_email',
        {
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'NotAuthorizedException'


def test_confirm_email_invalid_request(client):
    # LOGIN
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

    response = client.post_json('/api/confirm_email')

    assert response.status_code == 200
    assert not response.json['success']


def test_confirm_email_right_token(client):
    # LOGIN
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
        '/api/confirm_email',
        {
            'token': '123456'
        }
    )

    assert response.status_code == 200
    assert response.json['success']
    assert response.json['user']['email'] == 'test@test.com'


def test_confirm_email_wrong_token(client):
    # LOGIN
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
        '/api/confirm_email',
        {
            'token': '123456kdjfkdjf'
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'EmailValidationTokenInvalidException'


def test_confirm_email_right_token_wrong_user(client):
    # LOGIN
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
        '/api/confirm_email',
        {
            'token': '1337'
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'EmailMismatchException'


def test_confirm_email_already_confirmed(client):
    # LOGIN
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
        '/api/confirm_email',
        {
            'token': '123456'
        }
    )

    assert response.status_code == 200
    assert response.json['success']

    response = client.post_json(
        '/api/confirm_email',
        {
            'token': '123456'
        }
    )

    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'EmailAlreadyConfirmedException'
