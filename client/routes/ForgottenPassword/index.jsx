import { injectReducer } from 'store/reducers'

const routeName = 'forgottenpassword'

export default (store) => ({
  path: routeName,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Container = require('./containers/Container').default
      const reducer = require('./modules/reducer').default
      injectReducer(store, { key: routeName, reducer })
      cb(null, Container)
    })
  }
})
