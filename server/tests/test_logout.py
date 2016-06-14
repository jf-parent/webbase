
def test_logout_not_authorized(client):
    response = client.post_json(
        '/api/logout',
        {
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'NotAuthorizedException'


def test_logout_with_right_token(client):
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
        '/api/logout',
        {
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert response.json['success']


def test_logout_without_token(client):
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

    response = client.post_json('/api/logout')
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'


def test_logout_with_wrong_token(client):
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
        '/api/logout',
        {
            'token': '1337'
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'CSRFMismatch'
