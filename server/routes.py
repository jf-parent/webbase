from server.public.views import *  # noqa
from server.auth.views import *  # noqa

routes = [
    # CLIENT ROUTE => not /api/* and not /static/*
    ('GET', r'/{to:(?!api)(?!static).*}', index, 'index'),

    # API ROUTES
    ('GET', '/api/get_session', api_get_session, 'get_session'),
    ('GET', '/api/admin', api_admin, 'admin'),
    ('POST', '/api/save_model', api_save_model, 'api_save_model'),
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
    ('*', '/api/login', Login, 'api_login'),
    ('*', '/api/register', Register, 'api_register'),
    ('*', '/api/logout', Logout, 'api_logout'),
]
