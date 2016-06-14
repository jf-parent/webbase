var webpack = require('webpack');
var serverConfig = require('./configs/server');

var isDev = process.env.NODE_ENV == 'development';
var isProd = process.env.NODE_ENV == 'production';
var isTest = process.env.NODE_ENV == 'test';
var logLevel = isDev ? "'debug'" : "'error'";

definePlugin = new webpack.DefinePlugin({
  __DEV__: isDev,
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
} else {
    console.log('[*] Using DEV config');
    config = require('./webpack.dev.config.js');
}

module.exports = config;
