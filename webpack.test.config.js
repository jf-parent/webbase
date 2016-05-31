var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'client');

console.log('[*] BUILD_DIR:', BUILD_DIR);
console.log('[*] APP_DIR:', APP_DIR);

var config = {

   resolve: {
      root: path.resolve('./client'),
      extensions: ['', '.js', '.jsx'],
      alias: { sinon: 'sinon/pkg/sinon' }
   },

   debug: false,

   profile: false,

   entry: [
       APP_DIR + '/entry.jsx'
   ],

   output: {
     path: BUILD_DIR + '/static/scripts/',
     filename: '[name].js',
     chunkFilename: '[name].chunk.js',
     publicPath: '/static/scripts/'
   },

  plugins: [
//      new webpack.HotModuleReplacementPlugin(),
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
    noParse: [/sinon/],
    loaders : [
      { test: /sinon.*\.js$/,   loader: "imports?define=>false,require=>false"  },
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
    }
};

module.exports = config;
