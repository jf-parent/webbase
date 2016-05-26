import { requireAuth } from 'Auth'

export default (store) => ({
  path: 'profile',
  onEnter: requireAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Profile = require('./containers/ProfileContainer').default
      cb(null, Profile)
    })
  }
})

