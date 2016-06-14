import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import Login from 'routes/Login'
import Logout from 'routes/Logout'
import Profile from 'routes/Profile'
import ErrorPage from 'routes/ErrorPage'
import ForgottenPassword from 'routes/ForgottenPassword'
import Settings from 'routes/Settings'
import Register from 'routes/Register'
import Confirmation from 'routes/Confirmation'
import ResetPassword from 'routes/ResetPassword'

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout,
  childRoutes: [
    ResetPassword(store),
    Login(store),
    Profile(store),
    ForgottenPassword(store),
    Logout(store),
    Settings(store),
    Register(store),
    Confirmation(store),
    ErrorPage(store)
  ]
})

export default createRoutes
