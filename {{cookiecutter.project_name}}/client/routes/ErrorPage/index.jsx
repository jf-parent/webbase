export default (store) => ({
  path: '*',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Container = require('./containers/Container').default
      cb(null, Container)
    })
  }
})
