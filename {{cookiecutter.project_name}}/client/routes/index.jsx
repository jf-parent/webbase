import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import Login from 'routes/Login'
import Profile from 'routes/Profile'
import ErrorPage from 'routes/ErrorPage'
import ForgottenPassword from 'routes/ForgottenPassword'
import ComponentLibrary from 'routes/ComponentLibrary'
{%- if cookiecutter.include_registration == 'y' %}
import Register from 'routes/Register'
{%- endif %}
import Confirmation from 'routes/Confirmation'
import ResetPassword from 'routes/ResetPassword'
import Dashboard from 'routes/Dashboard'
import PrivacyPolicy from 'routes/PrivacyPolicy'
import BrowserNotSupported from 'routes/BrowserNotSupported'

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout,
  childRoutes: [
    BrowserNotSupported(store),
    PrivacyPolicy(store),
    Dashboard(store),
{%- if cookiecutter.include_registration == 'y' %}
    Register(store),
{%- endif %}
    Login(store),
    Profile(store),
    ForgottenPassword(store),
    ComponentLibrary(store),
    ResetPassword(store),
    Confirmation(store),
    ErrorPage(store)
  ]
})

export const notAuthRoutes = [
  '/login',
{%- if cookiecutter.include_registration == 'y' %}
  '/register',
{%- endif %}
  '/forgottenpassword',
  '/privacy-policy',
  '/browsernotsupported'
]
