import requireAuth from "Auth"

module.exports = {
  path: "logout",
  onEnter: requireAuth,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require("./components/Logout"))
    })
  }
}
