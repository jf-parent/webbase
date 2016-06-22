'use strict'

import {
  UPDATE_NOTIFICATIONS,
  UPDATE_NEW_NOTIFICATIONS_NUMBER,
  OPEN_NOTIFICATION_POPUP,
  CLOSE_NOTIFICATION_POPUP
} from '../actions/NotificationActions'

const initialState = {
  limit: 10,
  skip: 0,
  notificationPopupOpened: false,
  notifications: [],
  totalNotifications: 0,
  newNotificationNumber: 0
}

export default function notification (state = initialState, action) {
  switch (action.type) {
    case UPDATE_NOTIFICATIONS:
      return Object.assign({},
        state,
        {
          notifications: action.data.notifications,
          limit: action.data.limit,
          skip: action.data.skip,
          newNotificationNumber: action.data.newNotificationNumber,
          totalNotifications: action.data.totalNotifications
        }
      )

    case UPDATE_NEW_NOTIFICATIONS_NUMBER:
      return Object.assign({},
        state,
        {
          newNotificationNumber: action.data
        }
      )

    case CLOSE_NOTIFICATION_POPUP:
      return Object.assign({},
        state,
        {
          notificationPopupOpened: false
        }
      )

    case OPEN_NOTIFICATION_POPUP:
      return Object.assign({},
        state,
        {
          notificationPopupOpened: true
        }
      )

    default:
      return state
  }
}
