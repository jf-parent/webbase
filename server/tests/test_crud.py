def test_crud_not_authorized(client):
    response = client.post_json(
        '/api/crud/r',
        {
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'NotAuthorizedException'


def test_crud_invalid_request(client):
    client.login('test@test.com')

    response = client.post_json(
        '/api/crud/r',
        {
            'token': client.__token__
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'


def test_save_model_invalid_model(client):
    client.login('test@test.com')

    response = client.post_json(
        '/api/crud/r',
        {
            'token': client.__token__,
            'model': 'invalid'
        }
    )
    assert response.status_code == 200
    assert not response.json['success']
    assert response.json['error'] == 'InvalidRequestException'
