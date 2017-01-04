const webpack = require('webpack');
const fs = require('fs')
const path = require('path');
const DashboardPlugin = require('webpack-dashboard/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const serverConfig = require('./configs/server');
const BUILD_DIR = path.resolve(__dirname, 'dist-dev');
const APP_DIR = path.resolve(__dirname, 'client');
const serverAddr = serverConfig['server_host'] + ':' + serverConfig['server_port'];
const clientPort = '8080';
const clientAddr = serverConfig['server_host'] + ':' + clientPort;

console.log('[*] BUILD_DIR:', BUILD_DIR);
console.log('[*] APP_DIR:', APP_DIR);
console.log('[*]', definePlugin['definitions']);

var config = {
   resolve: {
      root: path.resolve('./client'),
      extensions: ['', '.js', '.jsx']
   },

   entry: [
       APP_DIR + '/entry.jsx'
   ],

   output: {
     path: BUILD_DIR + '/static/',
     filename: '[name].js',
     chunkFilename: '[name].chunk.js',
     publicPath: '/static/'
   },

  plugins: [
      new ExtractTextPlugin('style.css', { allChunks: true }),
      new webpack.ProvidePlugin({
        'window.Tether': 'tether',
      }),
      new HtmlWebpackPlugin({
        inject: true,
        filename: BUILD_DIR + '/index.html',
        template: APP_DIR + '/views/index.tpl'
      }),
      definePlugin
  ],

  module : {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['eslint'],
        include: APP_DIR
      }
    ],
    loaders : [
      { test : /\.(js|jsx)$/, include : APP_DIR, loader : 'babel' },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      {
        test: /\.(jpg|jpeg|gif|png|ico)$/,
        exclude: /node_modules/,
        loader:'file-loader?name=img/[path][name].[ext]&context=./client/images'
      },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.json$/, loader: 'json' }

    ]
  }
};

if (process.env.NODE_ENV !== 'build-development') {
  console.log('[*] CONFIGURING DEV SERVER');
  config.devServer = {
      publicPath: '/static/',

      host: '0.0.0.0',
      port: clientPort,

      contentBase: BUILD_DIR,

      inline: true,

      hot: true,

      historyApiFallback: true,

      stats: 'errors-only',

      headers: {
        'Access-Control-Allow-Origin': 'http://' + serverAddr,
        'Access-Control-Allow-Headers': 'X-Requested-With'
      },

      proxy: {
        '/api/*': 'http://' + serverAddr
      }
  }

  config.entry.push('webpack-dev-server/client?http://' + clientAddr)
  config.entry.push('webpack/hot/dev-server')
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  config.plugins.push(new DashboardPlugin())
}

module.exports = config;
