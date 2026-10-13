const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const apiUrl = process.env.REACT_APP_API_URL || '/api/v1';

module.exports = (env, argv) => ({
  entry: path.resolve(__dirname, 'src/main.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  resolve: { extensions: ['.js', '.jsx', '.json'] },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]] },
        },
      },
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|jpe?g|gif|svg|webp|woff2?)$/i, type: 'asset/resource' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'index.html'), inject: 'body' }),
    new CopyWebpackPlugin({ patterns: [{ from: path.resolve(__dirname, 'public'), to: path.resolve(__dirname, 'dist'), noErrorOnMissing: true }] }),
    new webpack.DefinePlugin({ 'process.env.REACT_APP_API_URL': JSON.stringify(apiUrl) }),
  ],
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    historyApiFallback: true,
    hot: true,
    proxy: [
      { context: ['/api'], target: 'http://localhost:5000', changeOrigin: true },
      { context: ['/uploads'], target: 'http://localhost:5000', changeOrigin: true },
    ],
  },
  devtool: argv.mode === 'development' ? 'eval-cheap-module-source-map' : 'source-map',
});
