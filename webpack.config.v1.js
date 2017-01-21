/**
 * For bundling and generating Version 1 of this API.
 */

const path = require('path');

module.exports = {
  entry: [path.resolve(__dirname, 'v1/badi.js')],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.v1.js',
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
    ],
  },
};
