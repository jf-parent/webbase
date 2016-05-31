'use strict'

import {
  AUTH_GETTING_SESSION,
  AUTH_GETTING_SESSION_SUCCESS,
  AUTH_GETTING_SESSION_ERROR,
  AUTH_RESET_SESSION
} from '../actions/AuthActions'

const initialState = {
  loading: true,
  error: null,
  user: null,
  email: null
}

export default function session (state = initialState, action) {
  switch (action.type) {
    case AUTH_GETTING_SESSION:
      return Object.assign({},
        state,
        {
          loading: true
        }
      )

    case AUTH_GETTING_SESSION_SUCCESS:
      return Object.assign({},
        state,
        {
          loading: false,
          user: action.data.user,
          email: action.data.email
        }
      )

    case AUTH_GETTING_SESSION_ERROR:
      return Object.assign({},
        state,
        {
          loading: false,
          error: action.errorAuth
        }
      )

    case AUTH_RESET_SESSION:
      return Object.assign({},
        state,
        {
          user: null
        }
      )

    default:
      return state
  }
}
