import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import Login from 'routes/Login'
import Profile from 'routes/Profile'
// import Home from 'routes/Home'

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout,
  // indexRoute: Home,
  childRoutes: [
    Login(store),
    Profile(store)
  ]

  /*
  getChildRoutes (location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./routes/Login').default(store),
        require('./routes/Profile'.default(store)),
        require('./routes/Settings'.default(store)),
        require('./routes/Register'.default(store)),
        require('./routes/Logout'.default(store)),
        require('./routes/ErrorPage')
      ])
    })
  }
  */
})

export default createRoutes
