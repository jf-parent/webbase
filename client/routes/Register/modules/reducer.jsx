import axios from 'axios'

import { getSessionSuccess } from 'actions/AuthActions'

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
logger.setLevel('debug')

export function doRegister (data) {
  return dispatch => {
    dispatch({type: REGISTER_LOADING})

    axios.post('/api/register', data)
      .then((response) => {
        logger.debug('/api/register (data) (response)', data, response)

        if (response.data.success) {
          dispatch(resetRegisterState())
          dispatch(getSessionSuccess(response.data))
        } else {
          dispatch(registerError('An error has occured: ' + response.data.error))
        }
      })
      .catch((response) => {
        logger.debug('/api/register error (data) (response)', data, response)
        dispatch(registerError('An error has occured: ' + response.data.error))
      })
  }
}

function registerError (error) {
  return {
    type: REGISTER_ERROR,
    error
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
  error: null
}

export default function login (state = initialState, action) {
  switch (action.type) {
    case REGISTER_LOADING:
      return Object.assign({},
        state,
        {
          loading: true
        }
      )

    case REGISTER_ERROR:
      return Object.assign({},
        state,
        {
          loading: false,
          error: action.error
        }
      )
    case REGISTER_RESET_STATE:
      return Object.assign({},
        state,
        {
          loading: false,
          error: null
        }
      )
    default:
      return state
  }
}
