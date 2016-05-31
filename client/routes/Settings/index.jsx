import { requireAuth } from '../../Auth'

export default (store) => ({
  path: 'settings',
  onEnter: requireAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Settings = require('./containers/SettingsContainer').default
      cb(null, Settings)
    }, 'settings')
  }
})
