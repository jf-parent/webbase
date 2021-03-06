import React from 'react'
import { IntlProvider, intlShape } from 'react-intl'
import { Provider, connect } from 'react-redux'
import { mount, shallow } from 'enzyme'
import { bindActionCreators } from 'redux'

import { injectReducer } from 'store/reducers'
import InitStoreHistory from 'helpers/InitStoreHistory'
import messages from 'locales/messages'

require('polyfills')
require('babel-polyfill')

const intlProvider = new IntlProvider({ locale: 'en', messages: messages['en'] }, {})
const reduxProvider = new Provider({ store: InitStoreHistory.store })
export const { intl } = intlProvider.getChildContext()
export const { store } = reduxProvider.getChildContext()

function nodeWithProps (node) {
  return React.cloneElement(node, { intl: intl, store: store })
}

export function mountWithContext (node) {
  return mount(nodeWithProps(node), {
    context: { intl },
    childContextTypes: { intl: intlShape }
  })
}

export function injectRequiredReducer (key, reducer) {
  injectReducer(store, { key, reducer })
}

export function shallowWithContext (node) {
  return shallow(nodeWithProps(node), { context: { intl } })
}

export function createContainer (component, actions) {
  function mapStateToProps (state) {
    return {
      state
    }
  }

  function mapDispatchToProps (dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    }
  }

  let Container = connect(mapStateToProps, mapDispatchToProps)(component)
  return mountWithContext(<Container />)
}
