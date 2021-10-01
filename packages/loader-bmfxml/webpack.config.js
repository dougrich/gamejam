const path = require('path')

module.exports = {
  entry: './loader-bmfxml.test.entry.js',
  output: {
    path: __dirname,
    filename: 'loader-bmfxml.test.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.font.xml$/,
        type: 'javascript/auto',
        use: [
          {
            loader: path.resolve(__dirname, 'loader-bmfxml.js')
          }
        ]
      }
    ]
  }
}
