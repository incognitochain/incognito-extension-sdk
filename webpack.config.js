const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        warnings: false,
        compress: {
          comparisons: false,
          drop_console: true,
        },
        parse: {},
        mangle: true,
        output: {
          comments: false,
          ascii_only: true,
        },
      },
    }),
  ],
};

module.exports = {
  entry: './index.js',
  output: {
    filename: 'incognito-extension-sdk.min.js',
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, 'dist'),
    library: 'incognito-extension-sdk',
    libraryTarget: 'umd',
    libraryExport: ['default'],
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
    ],
  },
  optimization,
  plugins: [new CleanWebpackPlugin()],
};