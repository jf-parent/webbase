import axios from 'axios'

// ====================================
// Constants
// ====================================

export const REDIRECT_CONFIRMING_EMAIL = 'REDIRECT_CONFIRMING_EMAIL'
export const REDIRECT_CONFIRM_EMAIL_SUCCESS = 'REDIRECT_CONFIRM_EMAIL_SUCCESS'
export const REDIRECT_CONFIRM_EMAIL_ERROR = 'REDIRECT_CONFIRM_EMAIL_ERROR'

// ====================================
// Logger
// ====================================

const logger = require('loglevel').getLogger('Redirect')
logger.setLevel(__LOGLEVEL__)

// ====================================
// Actions
// ====================================

export function doConfirmEmail (token) {
  return dispatch => {
    dispatch({type: REDIRECT_CONFIRMING_EMAIL})

    axios.post('/api/confirm_email', {token: token})
      .then((response) => {
        logger.debug('/api/confirm_email (response)', response)
        if (response.data.success) {
          dispatch(confirmEmailSuccess())
        } else {
          dispatch(confirmEmailError(response.data.error))
        }
      })
      .catch((response) => {
        logger.debug('/api/confirm_email error (response)', response)
        dispatch(confirmEmailError(response.data.error))
      })
  }
}

export function confirmEmailSuccess () {
  return {
    type: REDIRECT_CONFIRM_EMAIL_SUCCESS,
    msgId: 'redirect.EmailConfirmationSuccessful'
  }
}

export function confirmEmailError (error) {
  return {
    type: REDIRECT_CONFIRM_EMAIL_ERROR,
    error
  }
}

export const actions = {
  doConfirmEmail
}

// ====================================
// Reducers
// ====================================

const initialState = {
  loading: false,
  error: null
}

export default function logout (state = initialState, action) {
  switch (action.type) {
    case REDIRECT_CONFIRMING_EMAIL:
      return Object.assign({},
        state,
        {
          loading: true
        }
      )

    case REDIRECT_CONFIRM_EMAIL_SUCCESS:
      return Object.assign({},
        state,
        {
          loading: false,
          msgId: action.msgId,
          error: null
        }
      )

    case REDIRECT_CONFIRM_EMAIL_ERROR:
      return Object.assign({},
        state,
        {
          loading: false,
          error: action.error
        }
      )
    default:
      return state
  }
}

