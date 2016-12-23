from server.public.views import (
    index,
    api_get_session,
    api_validate_reset_password_token,
    api_check_email_disponibility,
    api_send_reset_password_token
)
from server.auth.views import (
    api_admin,
    api_confirm_email,
    api_reset_password,
    Login,
{%- if cookiecutter.include_registration == 'y' %}
    Register,
{%- endif %}
    Logout
)
from server.crud.views import CRUD

routes = [
    # CLIENT ROUTE => not /api/* and not /static/*
    ('GET', r'/{to:(?!api)(?!static).*}', index, 'index'),

    # API ROUTES
    ('POST', '/api/get_session', api_get_session, 'get_session'),
    ('GET', '/api/admin', api_admin, 'admin'),
    (
        'POST',
        '/api/check_email_disponibility',
        api_check_email_disponibility,
        'api_check_email_disponibility'
    ),
    ('POST', '/api/confirm_email', api_confirm_email, 'api_confirm_email'),
    ('POST', '/api/reset_password', api_reset_password, 'api_reset_password'),
    (
        'POST',
        '/api/validate_reset_password_token',
        api_validate_reset_password_token,
        'api_validate_reset_password_token'
    ),
    (
        'POST',
        '/api/send_reset_password_token',
        api_send_reset_password_token,
        'api_send_reset_password_token'
    ),
    ('*', '/api/crud', CRUD, 'api_crud'),
    ('*', '/api/login', Login, 'api_login'),
{%- if cookiecutter.include_registration == 'y' %}
    ('*', '/api/register', Register, 'api_register'),
{%- endif %}
    ('*', '/api/logout', Logout, 'api_logout'),
]
