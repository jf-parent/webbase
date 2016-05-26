import { requireNotAuth } from 'Auth'

export default (store) => ({
  path: 'login',
  onEnter: requireNotAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Login = require('./containers/LoginContainer').default
      cb(null, Login)
    })
  }
})
