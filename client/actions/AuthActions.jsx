import axios from 'axios'

import { AUTH_AUTHENTICATING, AUTH_AUTHENTICATED_SUCCESS, AUTH_AUTHENTICATED_ERROR, AUTH_GETTING_SESSION, AUTH_GETTING_SESSION_SUCCESS, AUTH_GETTING_SESSION_ERROR } from '../constants/ActionTypes'

const logger = require('loglevel').getLogger('AuthAction')
logger.setLevel('debug')

export function login (data) {
  return dispatch => {
    dispatch({type: AUTH_AUTHENTICATING})

    axios.post('/api/login', data)
      .then((response) => {
        logger.debug('/api/login (data) (response)', data, response)

        if (response.data.success) {
          dispatch(loginSuccess(response.data.user))
        } else {
          dispatch(loginError('Wrong email or password!'))
        }
      })
      .catch((response) => {
        logger.debug('/api/login error (data) (response)', data, response)
        dispatch(loginError('Not such user or wrong password'))
      })
  }
}

export function loginSuccess (user) {
  return {
    type: AUTH_AUTHENTICATED_SUCCESS,
    user
  }
}

export function loginError (errorLogin) {
  return {
    type: AUTH_AUTHENTICATED_ERROR,
    errorLogin
  }
}

export function getSession () {
  return dispatch => {
    dispatch({type: AUTH_GETTING_SESSION})

    axios.get('/api/get_session')
      .then((response) => {
        logger.debug('/api/get_session (response)', response)
        if (response.data.success) {
          dispatch(getSessionSuccess(response.data.user))
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

export function getSessionSuccess (response) {
  return {
    type: AUTH_GETTING_SESSION_SUCCESS,
    response
  }
}

export function getSessionError (errorAuth) {
  return {
    type: AUTH_GETTING_SESSION_ERROR,
    errorAuth
  }
}
