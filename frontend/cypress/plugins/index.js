const webpack = require('webpack');
const path = require('path');

module.exports = (on, config) => {
  on('file:preprocessor', require('@cypress/webpack-preprocessor')({
    webpackOptions: {
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
      },
      module: {
        rules: [
          {
            test: /\.(jsx|js)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
              },
            },
          },
          {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
          },
        ],
      },
    },
  }));
  return config;
};
