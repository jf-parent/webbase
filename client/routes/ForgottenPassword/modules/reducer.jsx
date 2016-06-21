import axios from 'axios'
import { routerActions } from 'react-router-redux'

import { getSessionRegistered } from 'actions/AuthActions'

// ====================================
// Constants
// ====================================

export const FORGOTTEN_PASSWORD_LOADING = 'FORGOTTEN_PASSWORD_LOADING'
export const SEND_RESET_PASSWORD_SUCCESS = 'SEND_RESET_PASSWORD_SUCCESS'
export const SEND_RESET_PASSWORD_ERROR = 'SEND_RESET_PASSWORD_ERROR'
export const VALIDATE_RESET_PASSWORD_TOKEN_ERROR = 'VALIDATE_RESET_PASSWORD_TOKEN_ERROR'
export const RESET_FORGOTTEN_PASSWORD_STATE = 'RESET_FORGOTTEN_PASSWORD_STATE'

// ====================================
// Logger
// ====================================

const logger = require('loglevel').getLogger('ForgottenPassword')
logger.setLevel(__LOGLEVEL__)

// ====================================
// Actions
// ====================================

export function doSendResetPasswordToken (data) {
  return dispatch => {
    dispatch({type: FORGOTTEN_PASSWORD_LOADING})

    axios.post('/api/send_reset_password_token', data)
      .then((response) => {
        logger.debug('/api/send_reset_password_token (response)', response)
        if (response.data.success) {
          dispatch(sendResetPasswordSuccess())
        } else {
          dispatch(sendResetPasswordError(response.data.error))
        }
      })
  }
}

export function sendResetPasswordSuccess () {
  return {
    type: SEND_RESET_PASSWORD_SUCCESS,
    successMsgId: 'forgottenPassword.SendResetPasswordTokenSuccessful'
  }
}

export function sendResetPasswordError (error) {
  const errorMsgId = 'forgottenPassword' + error
  return {
    type: SEND_RESET_PASSWORD_ERROR,
    errorMsgId
  }
}

export function doValidateResetPasswordToken (data) {
  return dispatch => {
    dispatch({type: FORGOTTEN_PASSWORD_LOADING})

    axios.post('/api/validate_reset_password_token', data)
      .then((response) => {
        logger.debug('/api/reset_password (response)', response)
        if (response.data.success) {
          dispatch(getSessionRegistered(response.data))
          dispatch(routerActions.push('/resetpassword?resetPasswordToken=' + data['reset_password_token']))
        } else {
          dispatch(validateResetPasswordTokenError(response.data.error))
        }
      })
      .catch((response) => {
        logger.debug('/api/reset_password error (response)', response)
        dispatch(validateResetPasswordTokenError(response.data.error))
      })
  }
}

export function validateResetPasswordTokenError (error) {
  const errorMsgId = 'forgottenPassword.' + error
  return {
    type: VALIDATE_RESET_PASSWORD_TOKEN_ERROR,
    errorMsgId
  }
}

export function resetForgottenPasswordState () {
  return {
    type: RESET_FORGOTTEN_PASSWORD_STATE
  }
}

export const actions = {
  doValidateResetPasswordToken,
  doSendResetPasswordToken,
  resetForgottenPasswordState
}

// ====================================
// Reducers
// ====================================

const initialState = {
  loading: false,
  redirectResetPassword: false,
  successMsgId: null,
  errorMsgId: null
}

export default function forgottenpassword (state = initialState, action) {
  switch (action.type) {
    case FORGOTTEN_PASSWORD_LOADING:
      return Object.assign({},
        initialState,
        {
          loading: true
        }
      )

    case SEND_RESET_PASSWORD_SUCCESS:
      return Object.assign({},
        initialState,
        {
          successMsgId: action.successMsgId
        }
      )

    case SEND_RESET_PASSWORD_ERROR:
      return Object.assign({},
        initialState,
        {
          errorMsgId: action.errorMsgId
        }
      )

    case VALIDATE_RESET_PASSWORD_TOKEN_ERROR:
      return Object.assign({},
        initialState,
        {
          errorMsgId: action.errorMsgId
        }
      )

    case RESET_FORGOTTEN_PASSWORD_STATE:
      return initialState

    default:
      return state
  }
}

