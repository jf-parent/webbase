'use strict'

import {
  AUTH_AUTHENTICATING,
  AUTH_AUTHENTICATED_SUCCESS,
  AUTH_AUTHENTICATED_ERROR,
  AUTH_GETTING_SESSION,
  AUTH_GETTING_SESSION_SUCCESS,
  AUTH_GETTING_SESSION_ERROR
} from '../constants/ActionTypes'

const initialState = {
  authenticated: false,
  loading: true,
  errorAuth: null,
  errorLogin: null,
  user: null,
  email: null
}

export default function session (state = initialState, action) {
  switch (action.type) {
    case AUTH_AUTHENTICATING:
      return Object.assign({},
        state,
        {
          loading: true
        }
      )

    case AUTH_AUTHENTICATED_SUCCESS:
      return Object.assign({},
        state,
        {
          loading: false,
          user: action.user,
          email: action.email
        }
      )

    case AUTH_AUTHENTICATED_ERROR:
      return Object.assign({},
        state,
        {
          loading: false,
          errorLogin: action.errorLogin
        }
      )

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
          user: action.user,
          email: action.email
        }
      )

    case AUTH_GETTING_SESSION_ERROR:
      return Object.assign({},
        state,
        {
          loading: false,
          errorAuth: action.errorAuth
        }
      )

    default:
      return state
  }
}
