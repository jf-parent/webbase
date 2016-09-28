import axios from 'axios'
import moment from 'moment-timezone'
import { routerActions } from 'react-router-redux'

import { getNotifications } from 'actions/NotificationActions'

// ====================================
// Constants
// ====================================

export const LOGOUT_LOADING = 'LOGOUT_LOADING'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_ERROR = 'LOGOUT_ERROR'
export const UPDATE_SESSION_NOTIFICATIONS = 'UPDATE_SESSION_NOTIFICATIONS'
export const UPDATE_SESSION_USER = 'UPDATE_SESSION_USER'
export const AUTH_GETTING_SESSION = 'AUTH_GETTING_SESSION'
export const AUTH_GETTING_SESSION_SUCCESS = 'AUTH_GETTING_SESSION_SUCCESS'
export const AUTH_GETTING_SESSION_ERROR = 'AUTH_GETTING_SESSION_ERROR'
export const AUTH_RESET_SESSION = 'AUTH_RESET_SESSION'
export const AUTH_GETTING_SESSION_REGISTERED = 'AUTH_GETTING_SESSION_REGISTERED'
export const AUTH_GETTING_SESSION_LOGGED_IN = 'AUTH_GETTING_SESSION_LOGGED_IN'

// ====================================
// Logger
// ====================================

const logger = require('loglevel').getLogger('AuthAction')
logger.setLevel(__LOGLEVEL__)

// ====================================
// Actions
// ====================================

export function getSession (loadingContext = false, cb = null) {
  return dispatch => {
    if (loadingContext) {
      dispatch({type: AUTH_GETTING_SESSION})
    }

    let userTz = moment.tz.guess()
    let data = {
      user_timezone: userTz
    }

    axios.post('/api/get_session', data)
      .then((response) => {
        logger.debug('/api/get_session (response)', response)
        if (response.data.success) {
          dispatch(getSessionSuccess(response.data))
          dispatch(getNotifications(response.data))
          if (cb) {
            cb()
          }
        } else {
          dispatch(getSessionError(response.data))
          if (cb) {
            cb()
          }
        }
      })
  }
}

export function updateSessionNotifications (data) {
  return {
    type: UPDATE_SESSION_NOTIFICATIONS,
    data
  }
}

export function updateSessionUser (data) {
  return {
    type: UPDATE_SESSION_USER,
    data
  }
}

export function getSessionSuccess (data) {
  return {
    type: AUTH_GETTING_SESSION_SUCCESS,
    data
  }
}

export function getSessionRegistered (data) {
  return {
    type: AUTH_GETTING_SESSION_REGISTERED,
    data
  }
}

export function getSessionLoggedIn (data) {
  return {
    type: AUTH_GETTING_SESSION_LOGGED_IN,
    data
  }
}

export function getSessionError (data) {
  return {
    type: AUTH_GETTING_SESSION_ERROR,
    data
  }
}

export function doLogout (token) {
  return dispatch => {
    dispatch({type: LOGOUT_LOADING})

    axios.post('/api/logout', {token: token})
      .then((response) => {
        logger.debug('/api/logout (response)', response)
        if (response.data.success) {
          dispatch(routerActions.push('/'))
          dispatch(logoutSuccess())
        } else {
          dispatch(logoutError(response.data.error))
        }
      })
  }
}

export function logoutSuccess () {
  return {
    type: LOGOUT_SUCCESS
  }
}

export function logoutError (error) {
  return {
    type: LOGOUT_ERROR,
    error
  }
}
