export const requireAuth = (store) => {
  return function (nextState, replace) {
    const session = store.getState().session
    if (!session.user) {
      replace({
        pathname: '/login',
        state: { nextPath: nextState.location }
      })
    }
  }
}
