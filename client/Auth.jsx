module.exports = function requireAuth(nextState, replace) {
  let test = false;
  if (test) {
    replace({
      pathname: "/login",
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

