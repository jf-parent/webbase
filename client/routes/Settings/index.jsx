module.exports = {
  path: 'settings',
  onEnter: window.iapp.Auth.requireAuth,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Settings'))
    })
  }
}
