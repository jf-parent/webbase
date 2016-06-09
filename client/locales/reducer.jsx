import messages from './messages'

// ====================================
// Constants
// ====================================

export const LOCALE_CHANGE = 'LOCALE_CHANGE'

// ====================================
// Actions
// ====================================

const logger = require('loglevel').getLogger('Locales')
logger.setLevel('debug')

export function doChangeLocale (locale) {
  return dispatch => {
    let strings = messages[locale]

    dispatch(changeLocale(locale, strings))
  }
}

function changeLocale (locale, messages) {
  return {
    type: LOCALE_CHANGE,
    locale,
    messages
  }
}

export const actions = {
  doChangeLocale
}

// ====================================
// Reducers
// ====================================

const initialState = {
  locale: navigator.language.split('-')[0],
  messages: messages['en']
}

export default function locales (state = initialState, action) {
  switch (action.type) {
    case LOCALE_CHANGE:
      return Object.assign({},
        state,
        {
          locale: action.locale,
          messages: action.messages
        }
      )

    default:
      return state
  }
}
