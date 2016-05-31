import React from 'react'
import { IntlProvider, intlShape } from 'react-intl'
import { Provider } from 'react-redux'
import { mount, shallow } from 'enzyme'
import { useRouterHistory } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'

import createStore from 'store/createStore'
import { injectReducer } from 'store/reducers'

require('polyfills')

const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: ''
})
const initialState = window.___INITIAL_STATE__
const messages = {'en': {'test': 'test'}}
const intlProvider = new IntlProvider({ locale: 'en', messages }, {})
const _store = createStore(initialState, browserHistory)
const reduxProvider = new Provider({ store: _store })
const { intl } = intlProvider.getChildContext()
const { store } = reduxProvider.getChildContext()

function nodeWithIntlProp (node) {
  return React.cloneElement(node, { intl: intl, store: store })
}

export default {
  injectRequiredReducer (key, reducer) {
    injectReducer(store, { key, reducer })
  },

  shallowWithIntl (node) {
    return shallow(nodeWithIntlProp(node), { context: { intl } })
  },

  mountWithContext (node) {
    return mount(nodeWithIntlProp(node), {
      context: { intl },
      childContextTypes: { intl: intlShape }
    })
  }
}
