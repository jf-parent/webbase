module.exports = {
  path: "login",
  onEnter: window.iapp.Auth.requireNotAuth,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require("./components/Login"))
    })
  }
}
