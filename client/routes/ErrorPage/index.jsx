export default (store) => ({
  path: '*',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const ErrorPage = require('./containers/ErrorPageContainer').default
      cb(null, ErrorPage)
    }, 'errorpage')
  }
})
