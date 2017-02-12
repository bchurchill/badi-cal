
const path = require('path');

module.exports = {
  entry: [path.resolve(__dirname, 'src/v2/index.js')],
  output: {
    path: path.join(__dirname, 'browser-build-v2'),
    filename: 'badi-cal.js',
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
    ],
  },
};
