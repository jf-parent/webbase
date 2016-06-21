import axios from 'axios'
import { routerActions } from 'react-router-redux'

import { getSessionRegistered } from 'actions/AuthActions'

// ====================================
// Constants
// ====================================

export const REGISTER_LOADING = 'REGISTER_LOADING'
export const REGISTER_ERROR = 'REGISTER_ERROR'
export const REGISTER_RESET_STATE = 'REGISTER_RESET_STATE'

// ====================================
// Actions
// ====================================

const logger = require('loglevel').getLogger('Register')
logger.setLevel(__LOGLEVEL__)

export function doRegister (data, nextPath) {
  return dispatch => {
    dispatch({type: REGISTER_LOADING})

    axios.post('/api/register', data)
      .then((response) => {
        logger.debug('/api/register (data) (response)', data, response)

        if (response.data.success) {
          dispatch(resetRegisterState())
          dispatch(getSessionRegistered(response.data))
          dispatch(routerActions.push(nextPath))
        } else {
          dispatch(registerError(response.data.error))
        }
      })
  }
}

function registerError (error) {
  const errorMsgId = 'errorMsg.' + error
  return {
    type: REGISTER_ERROR,
    errorMsgId
  }
}

export function resetRegisterState () {
  return dispatch => {
    dispatch({type: REGISTER_RESET_STATE})
  }
}

export const actions = {
  doRegister,
  resetRegisterState
}

// ====================================
// Reducers
// ====================================

const initialState = {
  loading: false,
  errorMsgId: null
}

export default function register (state = initialState, action) {
  switch (action.type) {
    case REGISTER_LOADING:
      return Object.assign({},
        initialState,
        {
          loading: true
        }
      )

    case REGISTER_ERROR:
      return Object.assign({},
        initialState,
        {
          errorMsgId: action.errorMsgId
        }
      )
    case REGISTER_RESET_STATE:
      return initialState

    default:
      return state
  }
}

