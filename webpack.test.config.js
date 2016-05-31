var webpack = require('webpack');
var fs = require('fs')
var path = require('path');
var serverConfig = require('./configs/server');
var ExportFilesWebpackPlugin = require('export-files-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'client');
var serverAddr = serverConfig['SERVER_HOST'] + ':' + serverConfig['SERVER_PORT'];
var clientPort = '8080';
var clientAddr = serverConfig['SERVER_HOST'] + ':' + clientPort;

console.log('[*] BUILD_DIR:', BUILD_DIR);
console.log('[*] APP_DIR:', APP_DIR);

var config = {

   resolve: {
      root: path.resolve('./client'),
      extensions: ['', '.js', '.jsx']
   },

   debug: false,

   //devtool: 'eval-source-map',

   profile: false,

   entry: [
       'webpack-dev-server/client?http://' + clientAddr,
       'webpack/hot/dev-server',
       APP_DIR + '/entry.jsx'
   ],

   output: {
     path: BUILD_DIR + '/static/scripts/',
     filename: '[name].js',
     chunkFilename: '[name].chunk.js',
     publicPath: '/static/scripts/'
   },

  plugins: [
      new webpack.HotModuleReplacementPlugin(),
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
      { test : /\.jsx?/, include : APP_DIR, loader : 'babel' },
      { test: /\.json$/, loader: 'json' },
      { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
    },

    externals: {
        'cheerio': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
    },

    devServer: {
        publicPath: '/static/scripts/',

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
