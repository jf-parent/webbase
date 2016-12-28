import { requireAuth } from 'Auth'

export default (store) => ({
  path: 'component-library',
  onEnter: requireAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Container = require('./containers/Container').default
      cb(null, Container)
    })
  }
})
