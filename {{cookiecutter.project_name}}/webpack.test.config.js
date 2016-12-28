const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'client');

console.log('[*] BUILD_DIR:', BUILD_DIR);
console.log('[*] APP_DIR:', APP_DIR);
console.log('[*]', definePlugin['definitions']);

var config = {

   resolve: {
      root: path.resolve('./client'),
      extensions: ['', '.js', '.jsx'],
      alias: { sinon: 'sinon/pkg/sinon' }
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
//      new webpack.HotModuleReplacementPlugin(),
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
    noParse: [/sinon/],
    loaders : [
      { test: /sinon.*\.js$/,   loader: "imports?define=>false,require=>false"  },
      { test : /\.(js|jsx)$/, include : APP_DIR, loader : 'babel' },
      { test: /\.json$/, loader: 'json' },
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
      { test: /\.(ttf|eot|svg|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
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
