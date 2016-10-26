var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  externals: ['dexie'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dexie-relationships.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
