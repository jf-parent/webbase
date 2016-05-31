import React from 'react'
import { IntlProvider, intlShape } from 'react-intl'
import { Provider } from 'react-redux'
import { mount, shallow } from 'enzyme'

import { injectReducer } from 'store/reducers'
import InitStoreHistory from 'helpers/InitStoreHistory'

require('polyfills')

// NOTE we provide an empty messages object
// because we use the defaultMessage in English
const messages = { 'en': {} }
const intlProvider = new IntlProvider({ locale: 'en', messages }, {})
const reduxProvider = new Provider({ store: InitStoreHistory.store })
const { intl } = intlProvider.getChildContext()
const { store } = reduxProvider.getChildContext()

function nodeWithProps (node) {
  return React.cloneElement(node, { intl: intl, store: store })
}

export default {
  injectRequiredReducer (key, reducer) {
    injectReducer(store, { key, reducer })
  },

  shallowWithContext (node) {
    return shallow(nodeWithProps(node), { context: { intl } })
  },

  mountWithContext (node) {
    return mount(nodeWithProps(node), {
      context: { intl },
      childContextTypes: { intl: intlShape }
    })
  }
}
