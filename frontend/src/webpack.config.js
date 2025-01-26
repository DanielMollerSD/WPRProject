const path = require('path');
const { defineConfig } = require('cypress');
const webpack = require('@cypress/webpack-preprocessor');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const options = {
        webpackOptions: require('./webpack.config.js'),
      };
      on('file:preprocessor', webpack(options));
      return config;
    },
  },
});


module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
        include: path.resolve(__dirname, 'src'), // Adjust this to match your source folder
      },
    ],
  },
};
