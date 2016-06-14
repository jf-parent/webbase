import { requireNotAuth } from '../../Auth'
import { injectReducer } from '../../store/reducers'

const routeName = 'login'

export default (store) => ({
  path: routeName,
  onEnter: requireNotAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Container = require('./containers/Container').default
      const reducer = require('./modules/reducer').default
      injectReducer(store, { key: routeName, reducer })
      cb(null, Container)
    })
  }
})
