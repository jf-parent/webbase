// ====================================
// Constants
// ====================================

export const RESET_DASHBOARD_STATE = 'RESET_DASHBOARD_STATE'
export const DISPLAY_SUCCESS_MSG = 'DISPLAY_SUCCESS_MSG'

// ====================================
// Logger
// ====================================

const logger = require('loglevel').getLogger('Dashboard')
logger.setLevel(__LOGLEVEL__)

// ====================================
// Actions
// ====================================

export function displaySuccessMsg (msg) {
  return {
    type: DISPLAY_SUCCESS_MSG,
    successMsgId: msg
  }
}

export function resetDashboardState () {
  return {
    type: RESET_DASHBOARD_STATE
  }
}

export const actions = {
  resetDashboardState,
  displaySuccessMsg
}

// ====================================
// Reducers
// ====================================

const initialState = {
  loading: false,
  successMsgId: null,
  errorMsgId: null
}

export default function resetPassword (state = initialState, action) {
  switch (action.type) {
    case RESET_DASHBOARD_STATE:
      return initialState

    case DISPLAY_SUCCESS_MSG:
      return Object.assign({},
        initialState,
        {
          successMsgId: action.successMsgId
        }
      )

    default:
      return state
  }
}

