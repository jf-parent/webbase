import { requireNotAuth } from 'Auth'
import { injectReducer } from 'store/reducers'

export default (store) => ({
  path: 'login',
  onEnter: requireNotAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Login = require('./containers/LoginContainer').default
      const reducer = require('./modules/reducer').default
      injectReducer(store, { key: 'login', reducer })
      cb(null, Login)
    }, 'login')
  }
})
