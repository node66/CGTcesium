const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name]_bundle.js',
    path: path.resolve(__dirname, 'build'),
    sourcePrefix: '',
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },{
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }, {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ['url-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    fallback: {'https': false, 'zlib': false, 'http': false, 'url': false},
    mainFiles: ['index', 'Cesium'],
  },
  optimization: {
    runtimeChunk: 'single'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {from: path.join(cesiumSource, cesiumWorkers), to: 'Workers'},
        {from: path.join(cesiumSource, 'Assets'), to: 'Assets'},
        {from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'},
        {from: path.join(cesiumSource, 'ThirdParty'), to: 'ThirdParty'}
      ]
    }),
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify('')
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
  },
  mode: 'development',
  devtool: 'eval',
};