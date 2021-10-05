const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './harness.js',
  plugins: [
    new HtmlWebpackPlugin()
  ],
  module: {
    rules: [
    ]
  }
}
