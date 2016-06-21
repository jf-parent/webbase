import axios from 'axios'

import { updateSessionUser } from 'actions/AuthActions'

// ====================================
// Constants
// ====================================

export const CONFIRMING_EMAIL = 'CONFIRMING_EMAIL'
export const CONFIRM_EMAIL_SUCCESS = 'CONFIRM_EMAIL_SUCCESS'
export const CONFIRM_EMAIL_ERROR = 'CONFIRM_EMAIL_ERROR'

// ====================================
// Logger
// ====================================

const logger = require('loglevel').getLogger('Confirmation')
logger.setLevel(__LOGLEVEL__)

// ====================================
// Actions
// ====================================

export function doConfirmEmail (token) {
  return dispatch => {
    dispatch({type: CONFIRMING_EMAIL})

    axios.post('/api/confirm_email', {token: token})
      .then((response) => {
        logger.debug('/api/confirm_email (response)', response)
        if (response.data.success) {
          dispatch(confirmEmailSuccess())
          dispatch(updateSessionUser(response.data.user))
        } else {
          dispatch(confirmEmailError(response.data.error))
        }
      })
  }
}

export function confirmEmailSuccess () {
  return {
    type: CONFIRM_EMAIL_SUCCESS,
    successMsgId: 'confirmation.EmailConfirmationSuccessful'
  }
}

export function confirmEmailError (error) {
  const errorMsgId = 'confirmation' + error
  return {
    type: CONFIRM_EMAIL_ERROR,
    errorMsgId
  }
}

export const actions = {
  doConfirmEmail
}

// ====================================
// Reducers
// ====================================

const initialState = {
  loading: false,
  successMsgId: null,
  errorMsgId: null
}

export default function confirmation (state = initialState, action) {
  switch (action.type) {
    case CONFIRMING_EMAIL:
      return Object.assign({},
        initialState,
        {
          loading: true
        }
      )

    case CONFIRM_EMAIL_SUCCESS:
      return Object.assign({},
        initialState,
        {
          successMsgId: action.successMsgId
        }
      )

    case CONFIRM_EMAIL_ERROR:
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

