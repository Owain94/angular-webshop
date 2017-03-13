const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const webpack = require('webpack');

const { GlobCopyWebpackPlugin, BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { AotPlugin } = require('@ngtools/webpack');

const baseHref = undefined;
const deployUrl = undefined;

module.exports = {
  "devtool": "source-map",
  "resolve": {
    "extensions": [
      ".ts",
      ".js"
    ],
    "modules": [
      "./node_modules"
    ]
  },
  "resolveLoader": {
    "modules": [
      "./node_modules"
    ]
  },
  "module": {
    "rules": [
      {
        "enforce": "pre",
        "test": /\.js$/,
        "loader": "source-map-loader",
        "exclude": [
          /\/node_modules\//
        ]
      },
      {
        "test": /\.json$/,
        "loader": "json-loader"
      },
      {
        "test": /\.html$/,
        "loader": "raw-loader"
      },
      {
        "test": /\.(eot|svg)$/,
        "loader": "file-loader?name=[name].[hash:20].[ext]"
      },
      {
        "test": /\.(jpg|png|gif|otf|ttf|woff|woff2|cur|ani)$/,
        "loader": "url-loader?name=[name].[hash:20].[ext]&limit=10000"
      },
      {
        "test": /\.ts$/,
        "loader": "@ngtools/webpack"
      }
    ]
  },
  "plugins": [
    new GlobCopyWebpackPlugin({
      "patterns": [
        "assets",
        "favicon.ico"
      ],
      "globOptions": {
        "cwd": "/Users/Owain/angular/angular-cli-universal/src",
        "dot": true,
        "ignore": "**/.gitkeep"
      }
    }),
    new ProgressPlugin(),
    new BaseHrefWebpackPlugin({}),
    new ExtractTextPlugin({
      "filename": "[name].bundle.css",
      "disable": true
    })
  ],
  "node": {
    "fs": "empty",
    "global": true,
    "crypto": "empty",
    "tls": "empty",
    "net": "empty",
    "process": true,
    "module": false,
    "clearImmediate": false,
    "setImmediate": false
  }
};