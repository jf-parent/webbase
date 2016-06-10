var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BUILD_DIR = path.resolve(__dirname, 'dist-prod');
var APP_DIR = path.resolve(__dirname, 'client');
var CleanWebpackPlugin = require('clean-webpack-plugin');

console.log('[*] BUILD_DIR:', BUILD_DIR);
console.log('[*] APP_DIR:', APP_DIR);
console.log('[*] definePlugin:', definePlugin);

var config = {

   resolve: {
      root: path.resolve('./client'),
      extensions: ['', '.js', '.jsx']
   },

   devtool: 'source-map',

   entry: [
       APP_DIR + '/entry.jsx'
   ],

   output: {
     path: BUILD_DIR + '/static/',
     filename: 'main.[hash].js',
     chunkFilename: '[id].[hash].chunk.js',
     publicPath: '/static/'
   },

  plugins: [
      new CleanWebpackPlugin(BUILD_DIR),
      new ExtractTextPlugin('style.css', { allChunks: true }),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        filename: BUILD_DIR + '/index.html',
        template: APP_DIR + '/views/index.tpl'
      }),
      definePlugin
  ],

  module : {
    loaders : [
      { test : /\.jsx?/, include : APP_DIR, loader : 'babel' },
      { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
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
  }
};

module.exports = config;
