import axios from 'axios'

// ====================================
// Constants
// ====================================

export const UPDATE_NOTIFICATIONS = 'UPDATE_NOTIFICATIONS'
export const UPDATE_NEW_NOTIFICATIONS_NUMBER = 'UPDATE_NEW_NOTIFICATIONS_NUMBER'
export const CLOSE_NOTIFICATION_POPUP = 'CLOSE_NOTIFICATION_POPUP'
export const OPEN_NOTIFICATION_POPUP = 'OPEN_NOTIFICATION_POPUP'
export const MARK_NOTIFICATION_AS_SEEN = 'MARK_NOTIFICATION_AS_SEEN'
export const MARK_ALL_NOTIFICATION_AS_SEEN = 'MARK_ALL_NOTIFICATION_AS_SEEN'

// ====================================
// Logger
// ====================================

const logger = require('loglevel').getLogger('Notification')
logger.setLevel(__LOGLEVEL__)

// ====================================
// Actions
// ====================================

export function doMarkAllNotificationHasSeen (session) {
  return dispatch => {
    axios.post('/api/crud/u', {
      token: session.token,
      data: {
        model: 'notification',
        return_results: false,
        seen: true,
        filters: {
          user_uid: session.user.uid
        }
      }
    })
    .then((response) => {
      logger.debug('/api/crud/u notification (response)', response)
      if (response.data.success) {
        dispatch(updateNewNotificationNumber(0))
      } else {
        logger.error('/api/crud/u notification (error)', response)
      }
    })
  }
}

export function doMarkNotificationHasSeen (session, uid) {
  return dispatch => {
    axios.post('/api/crud/u', {
      token: session.token,
      data: {
        model: 'notification',
        seen: true,
        filters: {
          uid: uid
        }
      }
    })
    .then((response) => {
      logger.debug('/api/crud/u notification (response)', response)
      if (response.data.success) {
        dispatch(getNotifications(session))
      } else {
        logger.error('/api/crud/u notification (error)', response)
      }
    })
  }
}

export function doCloseNotificationPopup () {
  return dispatch => {
    dispatch(closeNotificationPopup())
  }
}

export function doOpenNotificationPopup () {
  return dispatch => {
    dispatch(openNotificationPopup())
  }
}

export function getNotifications (session, skip = 0, limit = 10) {
  return dispatch => {
    axios.post('/api/crud/r', {
      token: session.token,
      data: [
        {
          model: 'notification',
          limit: limit,
          skip: skip,
          descending: 'created_ts',
          filters: {
            user_uid: session.user.uid
          }
        }, {
          model: 'notification',
          return_results: false,
          filters: {
            user_uid: session.user.uid,
            seen: false
          }
        }
      ]
    })
    .then((response) => {
      logger.debug('/api/crud/r notification (response)', response)
      if (response.data.success) {
        dispatch(updateNotifications(response.data.results, skip, limit))
      } else {
        logger.error('/api/crud/r notification (error)', response)
      }
    })
  }
}

export function updateNotifications (data, skip, limit) {
  let formattedData = {
    skip,
    limit,
    notifications: data[0].results,
    totalNotifications: data[0].total,
    newNotificationNumber: data[1].total
  }
  return {
    type: UPDATE_NOTIFICATIONS,
    data: formattedData
  }
}

export function updateNewNotificationNumber (data) {
  return {
    type: UPDATE_NEW_NOTIFICATIONS_NUMBER,
    data
  }
}

export function openNotificationPopup () {
  return {
    type: OPEN_NOTIFICATION_POPUP
  }
}

export function closeNotificationPopup () {
  return {
    type: CLOSE_NOTIFICATION_POPUP
  }
}

export const actions = {
  getNotifications,
  doOpenNotificationPopup,
  doMarkAllNotificationHasSeen,
  doMarkNotificationHasSeen,
  doCloseNotificationPopup
}
