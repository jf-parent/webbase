module.export = {
  path: '*',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/ErrorPage'))
    }, 'errorpage')
  }
}
