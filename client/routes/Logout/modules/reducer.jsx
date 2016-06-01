import axios from 'axios'

import { resetSession } from '../../../actions/AuthActions'

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
logger.setLevel(debugLevel)

// ====================================
// Actions
// ====================================

export function doLogout () {
  return dispatch => {
    dispatch({type: LOGOUT_LOADING})

    axios.get('/api/logout')
      .then((response) => {
        logger.debug('/api/logout (response)', response)
        if (response.data.success) {
          dispatch(logoutSuccess())
          dispatch(resetSession())
        } else {
          dispatch(logoutError(response.data.error))
        }
      })
      .catch((response) => {
        logger.debug('/api/logout error (response)', response)
        dispatch(logoutError(response.data.error))
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

export const actions = {
  doLogout
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
    case LOGOUT_LOADING:
      return Object.assign({},
        state,
        {
          loading: true
        }
      )

    case LOGOUT_SUCCESS:
      return Object.assign({},
        state,
        {
          loading: false,
          error: null
        }
      )

    case LOGOUT_ERROR:
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

