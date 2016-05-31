import { requireAuth } from '../../Auth'
import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'logout',
  onEnter: requireAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Logout = require('./containers/LogoutContainer').default
      const reducer = require('./modules/reducer').default
      injectReducer(store, { key: 'logout', reducer })
      cb(null, Logout)
    }, 'logout')
  }
})
