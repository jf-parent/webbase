export const requireNotAuth = (store) => {
  return function (nextState, replace) {
    const user = store.getState().session.user
    console.log('requireNotAuth (user)', user)
    if (user) {
      this.nextPath = nextState.location.pathname
      replace({
        pathname: '/profile'
      })
    }
  }
}

export const requireAuth = (store) => {
  return function (nextState, replace) {
    const user = store.getState().session.user
    console.log('requireAuth (user)', user)
    if (!user) {
      this.nextPath = nextState.location.pathname
      replace({
        pathname: '/login'
      })
    }
  }
}
