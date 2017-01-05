const webpack = require('webpack');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const APP_DIR = path.resolve(__dirname, 'client');
const current_date = (new Date()).valueOf().toString();
const random = Math.random().toString();
const versionHash = crypto.createHash('sha1').update(current_date + random).digest('hex');
const INDEX_TPL_FILE = 'index.tpl'
const isCordova = process.env.NODE_ENV === 'cordova';
let BUILD_DIR
let publicPath

if (isCordova) {
    BUILD_DIR = path.resolve(__dirname, 'www');
    publicPath = ''
} else {
    BUILD_DIR = path.resolve(__dirname, 'releases', versionHash);
    publicPath = '/static/'
}

var config = {

   resolve: {
      root: path.resolve('./client'),
      extensions: ['', '.js', '.jsx']
   },

   entry: [
       APP_DIR + '/entry.jsx'
   ],

   output: {
     path: BUILD_DIR + publicPath,
     filename: 'main.[hash].js',
     chunkFilename: '[id].[hash].chunk.js',
     publicPath
   },

  plugins: [
      new ExtractTextPlugin('style.css', { allChunks: true }),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        filename: BUILD_DIR + '/index.html',
        template: APP_DIR + '/views/' + INDEX_TPL_FILE
      }),
      definePlugin
  ],

  module : {
    loaders : [
      { test : /\.(js|jsx)$/, include : APP_DIR, loader : 'babel' },
      { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css')
      },
      {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('css!sass')
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      {
        test: /\.(jpg|jpeg|gif|png|ico)$/,
        exclude: /node_modules/,
        loader:'file-loader?name=[path][name].[ext]&context=./client/images'
      },
      { test: /\.(ttf|eot|svg|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  }
};

if (!isCordova) {
    // edit releases/last-version.txt with the current release hash
    fs.writeFile("./releases/latest.txt", versionHash, function(err) {
        if(err) {
            return console.error(err);
        }
    });
}

module.exports = config;
