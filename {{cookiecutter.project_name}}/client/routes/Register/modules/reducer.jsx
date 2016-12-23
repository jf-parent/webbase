import axios from 'axios'
import { routerActions } from 'react-router-redux'
import moment from 'moment-timezone'

import { getSessionRegistered } from 'reducers/session'
import { getNotifications } from 'reducers/notification'

// ====================================
// Constants
// ====================================

export const REGISTER_CHECK_EMAIL_DISPONIBILITY_LOADING = 'REGISTER_CHECK_EMAIL_DISPONIBILITY_LOADING'
export const REGISTER_CHECK_EMAIL_DISPONIBILITY_SUCCESS = 'REGISTER_CHECK_EMAIL_DISPONIBILITY_SUCCESS'
export const REGISTER_CHECK_EMAIL_DISPONIBILITY_ERROR = 'REGISTER_CHECK_EMAIL_DISPONIBILITY_ERROR'
export const REGISTER_LOADING = 'REGISTER_LOADING'
export const REGISTER_ERROR = 'REGISTER_ERROR'
export const REGISTER_RESET_STATE = 'REGISTER_RESET_STATE'

// ====================================
// Actions
// ====================================

const logger = require('loglevel').getLogger('Register')
logger.setLevel(__LOGLEVEL__)

export function doCheckEmailDisponibility (email) {
  return dispatch => {
    dispatch({type: REGISTER_CHECK_EMAIL_DISPONIBILITY_LOADING})

    let data = {
      email
    }

    axios.post('/api/check_email_disponibility', data)
      .then((response) => {
        logger.debug('/api/check_email_disponibility (data) (response)', data, response)

        if (response.data.success) {
          dispatch({type: 'REGISTER_CHECK_EMAIL_DISPONIBILITY_SUCCESS', data: response.data})
        } else {
          dispatch({type: 'REGISTER_CHECK_EMAIL_DISPONIBILITY_ERROR', error: response.data.error})
        }
      })
  }
}

export function doRegister (data, nextPath) {
  return dispatch => {
    dispatch({type: REGISTER_LOADING})

    data.user_timezone = moment.tz.guess()

    axios.post('/api/register', data)
      .then((response) => {
        logger.debug('/api/register (data) (response)', data, response)

        if (response.data.success) {
          dispatch(resetRegisterState())
          dispatch(getSessionRegistered(response.data))
          dispatch(getNotifications(response.data))
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
  doCheckEmailDisponibility,
  resetRegisterState
}

// ====================================
// Reducers
// ====================================

const initialState = {
  loading: false,
  checkingEmailDisponibility: false,
  emailIsAvailable: null,
  errorMsgId: null
}

export default function register (state = initialState, action) {
  switch (action.type) {
    case REGISTER_CHECK_EMAIL_DISPONIBILITY_LOADING:
      return Object.assign({},
        initialState,
        {
          checkingEmailDisponibility: true
        }
      )

    case REGISTER_CHECK_EMAIL_DISPONIBILITY_SUCCESS:
      return Object.assign({},
        initialState,
        {
          checkingEmailDisponibility: false,
          emailIsAvailable: action.data.available
        }
      )

    case REGISTER_CHECK_EMAIL_DISPONIBILITY_ERROR:
      return Object.assign({},
        initialState,
        {
          errorMsgId: action.data.error,
          checkingEmailDisponibility: false
        }
      )

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

