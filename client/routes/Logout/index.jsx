module.exports = {
  path: "logout",
  onEnter: window.iapp.Auth.requireAuth,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require("./components/Logout"))
    })
  }
}
