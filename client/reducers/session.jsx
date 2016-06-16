'use strict'

import {
  UPDATE_SESSION_USER,
  UPDATE_SESSION_NOTIFICATIONS,
  AUTH_GETTING_SESSION,
  AUTH_GETTING_SESSION_SUCCESS,
  AUTH_GETTING_SESSION_ERROR,
  AUTH_GETTING_SESSION_REGISTERED,
  AUTH_GETTING_SESSION_LOGGED_IN,
  AUTH_RESET_SESSION
} from '../actions/AuthActions'

const initialState = {
  loading: true,
  notifications: [],
  error: null,
  user: null,
  token: null
}

export default function session (state = initialState, action) {
  switch (action.type) {
    case AUTH_GETTING_SESSION:
      return Object.assign({},
        initialState,
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
          token: action.data.token
        }
      )

    case AUTH_GETTING_SESSION_REGISTERED:
      return Object.assign({},
        state,
        {
          loading: false,
          user: action.data.user
        }
      )

    case AUTH_GETTING_SESSION_LOGGED_IN:
      return Object.assign({},
        state,
        {
          loading: false,
          user: action.data.user
        }
      )

    case AUTH_GETTING_SESSION_ERROR:
      return Object.assign({},
        state,
        {
          loading: false,
          token: action.data.token,
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

    case UPDATE_SESSION_NOTIFICATIONS:
      return Object.assign({},
        state,
        {
          notifications: action.data
        }
      )

    case UPDATE_SESSION_USER:
      return Object.assign({},
        state,
        {
          user: action.data
        }
      )

    default:
      return state
  }
}
