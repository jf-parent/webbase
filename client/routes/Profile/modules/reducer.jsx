import axios from 'axios'

import { updateSessionUser } from 'actions/AuthActions'
import { displaySuccessMsg } from 'routes/Dashboard/modules/reducer'

// ====================================
// Constants
// ====================================

export const PROFILE_LOADING = 'PROFILE_LOADING'
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

    axios.post('/api/save_model', data)
      .then((response) => {
        logger.debug('/api/save_model (data) (response)', data, response)

        if (response.data.success) {
          dispatch(updateSessionUser(response.data.user))
          dispatch(displaySuccessMsg('profile.settingsSaveSuccessfully'))
        } else {
          dispatch(profileError(response.data.error))
        }
      })
      .catch((response) => {
        logger.debug('/api/save_model error (data) (response)', data, response)
        dispatch(profileError(response.data.error))
      })
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

