const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'travis' || process.env.NODE_ENV === 'build-development'
const isTravis = process.env.NODE_ENV === 'travis';
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isCordova = process.env.NODE_ENV === 'cordova';
const isElectron = process.env.NODE_ENV === 'electron';
const logLevel = isDev ? "'debug'" : "'error'";

let NODE_ENV = process.env.NODE_ENV
if (process.env.NODE_ENV === 'build-development') {
    NODE_ENV = 'development'
}

// BASE URL
let baseUrl = ''
if (isCordova || isElectron) {
    const serverConfig = require('./configs/server');
    baseUrl = serverConfig['cordova_base_url']
    console.log('baseUrl=', baseUrl)
}

// PLUGINS
definePlugin = new webpack.DefinePlugin({
  __DEV__: isDev,
  __GET_SESSION_INTERVAL__: 3000,
  __TEST__: isTest,
  __CORDOVA__: isCordova,
  __ELECTRON__: isElectron,
  __BASEURL__: JSON.stringify(baseUrl),
  __PROD__: isProd,
  __DEBUG__: isDev,
  __LOGLEVEL__: logLevel,
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
});

var config;
if (isProd || isTravis || isCordova || isElectron) {
    config = require('./webpack.prod.config.js');
} else if (isTest) {
    console.log('[*] Using TEST config');
    config = require('./webpack.test.config.js');
} else if (isDev) {
    console.log('[*] Using DEV config');
    config = require('./webpack.dev.config.js');
} else {
    console.error("No config found for the NODE_ENV:", process.env.NODE_ENV)
    process.exit(1)
}

module.exports = config;
