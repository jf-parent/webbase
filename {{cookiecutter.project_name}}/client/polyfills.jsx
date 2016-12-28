// ========================================================
// Polyfills
// ========================================================

var areIntlLocalesSupported = require('intl-locales-supported')

var localesMyAppSupports = [
  'en',
  'fr'
]

if (global.Intl) {
  if (!areIntlLocalesSupported(localesMyAppSupports)) {
    var IntlPolyfill = require('intl')
    Intl.NumberFormat = IntlPolyfill.NumberFormat
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
  }
} else {
  global.Intl = require('intl')
}
