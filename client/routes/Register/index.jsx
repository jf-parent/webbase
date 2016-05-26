module.exports = {
  path: 'register',
  onEnter: window.iapp.Auth.requireNotAuth,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Register'))
    })
  }
}

