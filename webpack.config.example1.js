
const path = require('path');

module.exports = {
  entry: [path.resolve(__dirname, 'src/v1/index.js')],
  output: {
    path: path.resolve(__dirname, 'src/examples/example1/dist'),
    filename: 'badi.js',
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
    ],
  },
};
