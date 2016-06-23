import axios from 'axios'

import { updateSessionUser, getSession } from 'actions/AuthActions'

// ====================================
// Constants
// ====================================

export const PROFILE_LOADING = 'PROFILE_LOADING'
export const PROFILE_SUCCESS = 'PROFILE_SUCCESS'
export const PROFILE_ERROR = 'PROFILE_ERROR'
export const PROFILE_RESET_STATE = 'PROFILE_RESET_STATE'

// ====================================
// Actions
// ====================================

const logger = require('loglevel').getLogger('Profile')
logger.setLevel(__LOGLEVEL__)

export function doSave (data) {
  return dispatch => {
    dispatch({type: PROFILE_LOADING})

    axios.post('/api/crud', data)
      .then((response) => {
        logger.debug('/api/crud (data) (response)', data, response)

        if (response.data.success) {
          dispatch(updateSessionUser(response.data.results[0]))
          dispatch(profileSuccess())
          dispatch(getSession(false))
        } else {
          dispatch(profileError(response.data.error))
        }
      })
  }
}

function profileSuccess () {
  return {
    type: PROFILE_SUCCESS,
    successMsgId: 'profile.settingsSaveSuccessfully'
  }
}

function profileError (error) {
  const errorMsgId = 'errorMsg.' + error
  return {
    type: PROFILE_ERROR,
    errorMsgId
  }
}

export function resetProfileState () {
  return dispatch => {
    dispatch({type: PROFILE_RESET_STATE})
  }
}

export const actions = {
  doSave,
  resetProfileState
}

// ====================================
// Reducers
// ====================================

const initialState = {
  loading: false,
  successMsgId: null,
  errorMsgId: null
}

export default function profile (state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return Object.assign({},
        initialState,
        {
          loading: true
        }
      )

    case PROFILE_SUCCESS:
      return Object.assign({},
        initialState,
        {
          loading: false,
          successMsgId: action.successMsgId,
          errorMsgId: null
        }
      )

    case PROFILE_ERROR:
      return Object.assign({},
        initialState,
        {
          errorMsgId: action.errorMsgId
        }
      )

    case PROFILE_RESET_STATE:
      return initialState

    default:
      return state
  }
}

