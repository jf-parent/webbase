const routeName = 'privacy-policy'

export default (store) => ({
  path: routeName,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Container = require('./containers/Container').default
      cb(null, Container)
    })
  }
})

