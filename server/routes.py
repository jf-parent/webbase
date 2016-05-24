from server.public.views import *  # noqa
from server.auth.views import *  # noqa

routes = [
    # CLIENT ROUTE => not /api/* and not /static/*
    ('GET', r'/{to:(?!api)(?!static).*}', index, 'index'),

    # API ROUTES
    ('GET', '/api/get_session', api_get_session, 'get_session'),
    ('GET', '/api/admin', api_admin, 'admin'),
    ('*', '/api/login', Login, 'api_login'),
    ('*', '/api/register', Register, 'api_register'),
    ('*', '/api/logout', Logout, 'api_logout'),
]
