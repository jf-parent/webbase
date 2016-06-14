import { injectReducer } from 'store/reducers'
import { requireAuth } from 'Auth'

const routeName = 'resetpassword'

export default (store) => ({
  path: routeName,
  onEnter: requireAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Container = require('./containers/Container').default
      const reducer = require('./modules/reducer').default
      injectReducer(store, { key: routeName, reducer })
      cb(null, Container)
    })
  }
})
