import axios from 'axios'

// ====================================
// Constants
// ====================================

export const RESET_PASSWORD_LOADING = 'RESET_PASSWORD_LOADING'
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS'
export const RESET_PASSWORD_ERROR = 'RESET_PASSWORD_ERROR'

// ====================================
// Logger
// ====================================

const logger = require('loglevel').getLogger('ResetPassword')
logger.setLevel(__LOGLEVEL__)

// ====================================
// Actions
// ====================================

export function doResetPassword (data) {
  return dispatch => {
    dispatch({type: RESET_PASSWORD_LOADING})

    axios.post('/api/reset_password', data)
      .then((response) => {
        logger.debug('/api/reset_password (response)', response)
        if (response.data.success) {
          dispatch(resetPasswordSuccess())
        } else {
          dispatch(resetPasswordError(response.data.error))
        }
      })
  }
}

export function resetPasswordSuccess () {
  return {
    type: RESET_PASSWORD_SUCCESS,
    successMsgId: 'resetPassword.ResetPasswordSuccess'
  }
}

export function resetPasswordError (error) {
  const errorMsgId = 'forgottenPassword.' + error
  return {
    type: RESET_PASSWORD_ERROR,
    errorMsgId
  }
}

export const actions = {
  doResetPassword
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
    case RESET_PASSWORD_LOADING:
      return Object.assign({},
        initialState,
        {
          loading: true
        }
      )

    case RESET_PASSWORD_SUCCESS:
      return Object.assign({},
        initialState,
        {
          successMsgId: action.successMsgId
        }
      )

    case RESET_PASSWORD_ERROR:
      return Object.assign({},
        initialState,
        {
          errorMsgId: action.errorMsgId
        }
      )

    default:
      return state
  }
}

