const path = require('path');

module.exports = {
  entry: './lib/index.js',

  resolve: {
    modules: [
      path.resolve('lib'),
      'node_modules'
    ],
    fallback: {
      "fs": false,
      "path": false,
      "util": false,
      "net": false,
      "http": false,
      "https": false,
      "dns": false,
      "crypto": false,
      "child_process": false,
      "stream": false,
      "zlib": false,
      "assert": false,
      "buffer": false,
      "os": false,
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
