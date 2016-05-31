var path = require('path');
var webpackConfig = require('./webpack.config.js');

config = function(config) {
  config.set({
    basePath: '',
    files: [
        './node_modules/phantomjs-polyfill/bind-polyfill.js',
        {
          pattern: './tests.webpack.js',
          watched: false,
          served: true,
          included: true
        }
    ],
    frameworks: ['mocha'],

    webpack: webpackConfig,

    preprocessors: {
        './tests.webpack.js': ['webpack', 'sourcemap'],
    },

    plugins: [
      'karma-mocha',
      'karma-phantomjs-launcher',
//      'karma-firefox-launcher',
//      'karma-chrome-launcher',
      'karma-spec-reporter',
      'karma-webpack',
      'karma-sourcemap-loader'
    ],

    reporters: ['spec'],
    hostname: '0.0.0.0',
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['PhantomJS'],
    debug: true,
    singleRun: false
  })
};

module.exports = config;
