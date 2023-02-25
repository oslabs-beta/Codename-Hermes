const path = require('path');
require('dotenv').config();
const process = require('process');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Determine which env to build for
  mode: process.env.TARGET ?? 'production',

  // The main file for the project
  entry: './src/index.tsx',

  module: {
    rules: [
      /**
       * If the file is .tsx or .ts, run the ts-loader extension on it.
       * Ignore the node_modules directory
       */
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/],
      },

      /**
       * If the file end with .sass, .scss, or .css then run the loaders defined in the "use" key from right to left.
       */
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },

      /**
       * This will check if the file is an image and it will get it, copy it to the build dir, then store a referance to it.
       */
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },

      // This will transform any SVG into a react component to be used.
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },

  resolve: {
    // Which file extensions do we want to resolve from imports?
    extensions: ['.tsx', '.ts', '.js'],
  },

  // Webpack dev server
  devServer: {
    static: './build',
    port: process.env.PORT ?? 8082,
    watchFiles: {
      // Which files do you want to monitor for changes so you can hot-reload them?
      paths: ['src/**/*'],
    },
  },

  // What do you want to have the final bundle be called? Where do you want it stored?
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },

  // Any extra functionality?
  plugins: [
    // This will create a new index.html file based on the specified template.
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};
