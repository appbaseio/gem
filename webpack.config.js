var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './app/app.js',
  output: { 
    path: path.join(__dirname, 'dist/js'),
    publicPath: '/dist/js', // instead of publicPath: '/build/' 
    filename: 'app.js'
  },
  inline: true,
  module: {
    preLoaders: [
        { test: /\.json$/, exclude: /node_modules/, loader: 'json'},
    ],
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015','stage-0', 'react']
        }
      }
    ]
  },
};