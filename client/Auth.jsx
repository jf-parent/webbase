export const requireNotAuth = (store) => {
  return function (nextState, replace) {
    const user = store.getState().session.user
    if (user) {
      replace({
        pathname: '/profile'
      })
    }
  }
}

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
