/*
* @Author: Zhang Yingya(hzzhangyingya)
* @Date:   2016-05-16 21:15:10
* @Last modified by:   zyy
* @Last modified time: 2016-07-11T11:44:13+08:00
*/

var env = require('./env')
var fs = require('fs-extra')
var path = require('path')
var webpack = require('webpack')
// var HtmlWebpackPlugin = require('html-webpack-plugin')

function genEntry () {
  var entryDir = path.resolve(__dirname, '../src/js/entry')
  var filenameList = fs.readdirSync(entryDir)
  var entry = {}
  filenameList.forEach(function (filename) {
    var index = filename.lastIndexOf('.')
    if (index === filename.length - 3) {
      var name = filename.slice(0, index)
      entry[name] = path.resolve(entryDir, filename)
    }
  })
  return entry
}

var config = {
  entry: genEntry(),
  output: {
    path: path.resolve(__dirname, '../dist/js'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.html$/, loader: 'raw' },
      { test: /\.yaml$/, loader: 'json!yaml' },
      { test: /\.css$/, loader: 'style!css!postcss' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          cacheDirectory: true,
          plugins: [
            'transform-es3-property-literals',
            'transform-es3-member-expression-literals',
            'add-module-exports',
            ['transform-es2015-modules-commonjs', {
              loose: true
            }]
          ]
        }
      }
    ]
  },
  resolve: {
    root: [
      path.resolve(__dirname, '../src/js')
    ],
    alias: {
      'data': path.resolve(__dirname, '../data'),
      'util': path.resolve(__dirname, '../submodule/zoro-base/src'),
      'strap': path.resolve(__dirname, '../submodule/regular-strap/src'),
      'regularjs': path.resolve(__dirname, '../node_modules/regularjs/dist/regular'),
      'restate': path.resolve(__dirname, '../node_modules/regular-state/restate-full'),
      'stateman': path.resolve(__dirname, '../node_modules/stateman/stateman')
    },
    extensions: ['', '.js', '.json', '.yaml']
  },
  plugins: [
    new webpack.ProvidePlugin({
      Regular: 'regularjs',
      restate: 'restate',
      _: 'lodash'
    }),
    new webpack.optimize.CommonsChunkPlugin('common.js')
  ]
}

var isProduction = env.isProduction()
if (!isProduction) {
  // sourceMap 相关
  config.output.pathinfo = true
  config.devtool = 'eval'
} else {
  [].push.apply(config.plugins, [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000})
  ])
}

module.exports = config
