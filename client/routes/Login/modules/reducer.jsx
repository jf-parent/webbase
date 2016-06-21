import axios from 'axios'
import { routerActions } from 'react-router-redux'

import { getSessionLoggedIn } from 'actions/AuthActions'

// ====================================
// Constants
// ====================================

export const LOGIN_LOADING = 'LOGIN_LOADING'
export const LOGIN_ERROR = 'LOGIN_ERROR'
export const LOGIN_RESET_STATE = 'LOGIN_RESET_STATE'

// ====================================
// Actions
// ====================================

const logger = require('loglevel').getLogger('Login')
logger.setLevel(__LOGLEVEL__)

export function doLogin (data, nextPath) {
  return dispatch => {
    dispatch({type: LOGIN_LOADING})

    axios.post('/api/login', data)
      .then((response) => {
        logger.debug('/api/login (data) (response)', data, response)

        if (response.data.success) {
          dispatch(resetLoginState())
          dispatch(getSessionLoggedIn(response.data))
          dispatch(routerActions.push(nextPath))
        } else {
          dispatch(loginError(response.data.error))
        }
      })
  }
}

function loginError (error) {
  const errorMsgId = 'errorMsg.' + error
  return {
    type: LOGIN_ERROR,
    errorMsgId
  }
}

export function resetLoginState () {
  return dispatch => {
    dispatch({type: LOGIN_RESET_STATE})
  }
}

export const actions = {
  doLogin,
  resetLoginState
}

// ====================================
// Reducers
// ====================================

const initialState = {
  loading: false,
  errorMsgId: null
}

export default function login (state = initialState, action) {
  switch (action.type) {
    case LOGIN_LOADING:
      return Object.assign({},
        initialState,
        {
          loading: true
        }
      )

    case LOGIN_ERROR:
      return Object.assign({},
        initialState,
        {
          errorMsgId: action.errorMsgId
        }
      )

    case LOGIN_RESET_STATE:
      return initialState

    default:
      return state
  }
}
