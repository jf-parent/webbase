import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import Login from 'routes/Login'
import Logout from 'routes/Logout'
import Profile from 'routes/Profile'
import ErrorPage from 'routes/ErrorPage'
import ForgottenPassword from 'routes/ForgottenPassword'
import ComponentLibrary from 'routes/ComponentLibrary'
import Register from 'routes/Register'
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
    ResetPassword(store),
    Login(store),
    Profile(store),
    ForgottenPassword(store),
    Logout(store),
    ComponentLibrary(store),
    Register(store),
    Confirmation(store),
    ErrorPage(store)
  ]
})

export const notAuthRoutes = ['/login', '/register', '/forgottenpassword', '/privacy-policy', '/browsernotsupported']
