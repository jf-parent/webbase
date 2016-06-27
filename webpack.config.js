var webpack = require('webpack');

var isDev = process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'travis';
var isTravis = process.env.NODE_ENV == 'travis';
var isProd = process.env.NODE_ENV == 'production';
var isTest = process.env.NODE_ENV == 'test';
var logLevel = isDev ? "'debug'" : "'error'";

definePlugin = new webpack.DefinePlugin({
  __DEV__: isDev,
  __GET_SESSION_INTERVAL__: 3000,
  __TEST__: isTest,
  __PROD__: isProd,
  __DEBUG__: isDev,
  '__LOGLEVEL__': logLevel,
 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
});

var config;
if (isProd) {
    console.log('[*] Using PROD config');
    config = require('./webpack.prod.config.js');
} else if (isTest) {
    console.log('[*] Using TEST config');
    config = require('./webpack.test.config.js');
} else if (isDev  || isTravis) {
    console.log('[*] Using DEV config');
    config = require('./webpack.dev.config.js');
} else {
    console.error("No config found for the NODE_ENV:", process.env.NODE_ENV)
    process.exit(1)
}

module.exports = config;
