import axios from 'axios'

// ====================================
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
    axios.post('/api/crud', {
      token: session.token,
      actions: {
        action: 'update',
        model: 'notification',
        total_only: true,
        data: {
          seen: true
        },
        filters: {
          user_uid: session.user.uid
        }
      }
    })
    .then((response) => {
      logger.debug('/api/crud notification (response)', response)
      if (response.data.success) {
        dispatch(updateNewNotificationNumber(0))
      } else {
        logger.error('/api/crud notification (error)', response)
      }
    })
  }
}

export function doMarkNotificationHasSeen (session, uid) {
  return dispatch => {
    axios.post('/api/crud', {
      token: session.token,
      actions: {
        action: 'update',
        model: 'notification',
        uid: uid,
        total_only: true,
        data: {
          seen: true
        }
      }
    })
    .then((response) => {
      logger.debug('/api/crud notification (response)', response)
      if (response.data.success) {
        dispatch(getNotifications(session))
      } else {
        logger.error('/api/crud notification (error)', response)
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
    axios.post('/api/crud', {
      token: session.token,
      actions: [
        {
          action: 'read',
          model: 'notification',
          limit: limit,
          skip: skip,
          descending: 'created_ts',
          filters: {
            user_uid: session.user.uid
          }
        }, {
          action: 'read',
          model: 'notification',
          filters: {
            user_uid: session.user.uid,
            seen: false
          }
        }
      ]
    })
    .then((response) => {
      logger.debug('/api/crud notification (response)', response)
      if (response.data.success) {
        dispatch(updateNotifications(response.data, skip, limit))
      } else {
        logger.error('/api/crud notification (error)', response)
      }
    })
  }
}

export function updateNotifications (data, skip, limit) {
  let formattedData = {
    skip,
    limit,
    notifications: data.results[0].results,
    totalNotifications: data.results[0].total,
    newNotificationNumber: data.results[1].total
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
