import bowser from 'bowser'

export default function (dispatch) {
  // https://github.com/ded/bowser

  let unsupportedBrowser = [
    {
      blink: '10'
    }
  ]
  for (let i = 0; i < unsupportedBrowser.length; i++) {
    let unsupported = bowser.isUnsupportedBrowser(unsupportedBrowser[i], window.navigator.userAgent)
    if (unsupported) {
      return false
    }
  }

  return true
}
