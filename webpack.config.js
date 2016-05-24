require('babel-polyfill');

var serverConfig = require('./configs/server');

var isProduction = !serverConfig['DEBUG'];

console.log('[*] isProduction:', isProduction);

if (isProduction) {
    process.env.NODE_ENV = 'production';
    var config = require('./webpack.prod.config.js');
} else {
    process.env.NODE_ENV = 'dev';
    var config = require('./webpack.dev.config.js');
}

module.exports = config;
