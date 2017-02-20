
const path = require('path');

module.exports = {
  entry: [path.resolve(__dirname, 'src/v1/index.js')],
  output: {
    path: path.resolve(__dirname, 'examples/example1/browser-build-v1'),
    filename: 'badi-cal.js',
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
    ],
  },
};
