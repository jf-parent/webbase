import axios from 'axios'

// ====================================
// Constants
// ====================================

export const AUTH_GETTING_SESSION = 'AUTH_GETTING_SESSION'
export const AUTH_GETTING_SESSION_SUCCESS = 'AUTH_GETTING_SESSION_SUCCESS'
export const AUTH_GETTING_SESSION_ERROR = 'AUTH_GETTING_SESSION_ERROR'
export const AUTH_RESET_SESSION = 'AUTH_RESET_SESSION'

// ====================================
// Logger
// ====================================

const logger = require('loglevel').getLogger('AuthAction')
logger.setLevel('debug')

// ====================================
// Actions
// ====================================

export function getSession () {
  return dispatch => {
    dispatch({type: AUTH_GETTING_SESSION})

    axios.get('/api/get_session')
      .then((response) => {
        logger.debug('/api/get_session (response)', response)
        if (response.data.success) {
          dispatch(getSessionSuccess(response.data))
        } else {
          dispatch(getSessionError(response.data.error))
        }
      })
      .catch((response) => {
        logger.debug('/api/get_session error (response)', response)
        dispatch(getSessionError(response.data.error))
      })
  }
}

export function getSessionSuccess (data) {
  return {
    type: AUTH_GETTING_SESSION_SUCCESS,
    data
  }
}

export function getSessionError (errorAuth) {
  return {
    type: AUTH_GETTING_SESSION_ERROR,
    errorAuth
  }
}

export function resetSession () {
  return {
    type: AUTH_RESET_SESSION
  }
}
