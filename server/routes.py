from server.public.views import *
from server.auth.views import *

routes = [
    #CLIENT ROUTE => not /api/* and not /static/*
    ('GET', r'/{to:(?!api)(?!static).*}', index, 'index'),

    #API ROUTES
    ('GET', '/api/get_session', api_get_session, 'get_session'),
    ('*', '/api/login', Login, 'api_login'),
    ('*', '/api/register', Register, 'api_register'),
    ('*', '/api/logout', Logout, 'api_logout'),
]
