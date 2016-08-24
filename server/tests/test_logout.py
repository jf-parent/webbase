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
    client.login('test@test.com')

    response = client.post_json(
        '/api/logout',
        {
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert response.json['success']


def test_logout_without_token(client):
    client.login('test@test.com')

    response = client.post_json('/api/logout')
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'


def test_logout_with_wrong_token(client):
    client.login('test@test.com')

    response = client.post_json(
        '/api/logout',
        {
            'token': '1337'
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'CSRFMismatch'
