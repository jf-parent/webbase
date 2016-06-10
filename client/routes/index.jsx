import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import Login from 'routes/Login'
import Logout from 'routes/Logout'
import Profile from 'routes/Profile'
import ErrorPage from 'routes/ErrorPage'
import Settings from 'routes/Settings'
import Register from 'routes/Register'
import Confirmation from 'routes/Confirmation'

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout,
  childRoutes: [
    Login(store),
    Profile(store),
    Logout(store),
    Settings(store),
    Register(store),
    Confirmation(store),
    ErrorPage(store)
  ]
})

export default createRoutes
