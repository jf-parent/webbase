import axios from 'axios'
import { routerActions } from 'react-router-redux'

import { resetSession } from 'actions/AuthActions'

// ====================================
// Constants
// ====================================

export const LOGOUT_LOADING = 'LOGOUT_LOADING'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_ERROR = 'LOGOUT_ERROR'

// ====================================
// Logger
// ====================================

const logger = require('loglevel').getLogger('Logout')
logger.setLevel(__LOGLEVEL__)

// ====================================
// Actions
// ====================================

export function doLogout (token) {
  return dispatch => {
    dispatch({type: LOGOUT_LOADING})

    axios.post('/api/logout', {token: token})
      .then((response) => {
        logger.debug('/api/logout (response)', response)
        if (response.data.success) {
          dispatch(logoutSuccess())
          dispatch(resetSession())
          dispatch(routerActions.push('/'))
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
  const errorMsgId = 'logout' + error
  return {
    type: LOGOUT_ERROR,
    errorMsgId
  }
}

export const actions = {
  doLogout
}

// ====================================
// Reducers
// ====================================

const initialState = {
  loading: false,
  errorMsgId: null
}

export default function logout (state = initialState, action) {
  switch (action.type) {
    case LOGOUT_LOADING:
      return Object.assign({},
        initialState,
        {
          loading: true
        }
      )

    case LOGOUT_SUCCESS:
      return initialState

    case LOGOUT_ERROR:
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
