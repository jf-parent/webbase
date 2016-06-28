const webpack = require('webpack');
const fs = require('fs')
const path = require('path');
var serverConfig

const isTravis = process.env.NODE_ENV == 'travis';
if (isTravis) {
    serverConfig = require('./configs/server-travis');
} else {
    serverConfig = require('./configs/server');
}
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BUILD_DIR = path.resolve(__dirname, 'dist-dev');
const APP_DIR = path.resolve(__dirname, 'client');
const serverAddr = serverConfig['SERVER_HOST'] + ':' + serverConfig['SERVER_PORT'];
const clientPort = '8080';
const clientAddr = serverConfig['SERVER_HOST'] + ':' + clientPort;

console.log('[*] BUILD_DIR:', BUILD_DIR);
console.log('[*] APP_DIR:', APP_DIR);
console.log('[*]', definePlugin['definitions']);

var config = {

   resolve: {
      root: path.resolve('./client'),
      extensions: ['', '.js', '.jsx']
   },

   entry: [
       'webpack-dev-server/client?http://' + clientAddr,
       'webpack/hot/dev-server',
       APP_DIR + '/entry.jsx'
   ],

   output: {
     path: BUILD_DIR + '/static/',
     filename: '[name].js',
     chunkFilename: '[name].chunk.js',
     publicPath: '/static/'
   },

  plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new ExtractTextPlugin('style.css', { allChunks: true }),
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
      }, {
        test: /\.postcss$/,
        loader: ExtractTextPlugin.extract(
            'style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
        )
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
  },

  devServer: {
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
};

module.exports = config;
