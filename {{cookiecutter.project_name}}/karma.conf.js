var argv = require('yargs').argv;
var webpackConfig = require('./webpack.config.js');

config = function(config) {
  config.set({
    basePath: '',
    files: [{pattern: './tests.webpack.js', watched: false, included: true, served: true}],
    frameworks: ['mocha', 'sinon'],

    webpack: webpackConfig,

    preprocessors: {
        './tests.webpack.js': ['webpack', 'sourcemap'],
    },

    plugins: [
      'karma-mocha',
      'karma-sinon',
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
    singleRun: !argv.watch
  })
};

module.exports = config;
