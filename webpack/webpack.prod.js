const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");
const postcssUrl = require("postcss-url");
const PurifyCSSPlugin = require("purifycss-webpack");

const { NoEmitOnErrorsPlugin } = require("webpack");

/**
 * This is a prod config to be merged with the Client config
 */
module.exports = {
  "plugins": [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      "mangle": {
        "keep_fnames": true,
        "screw_ie8": true
      },
      compress: {
        "warnings" : false
      }
    }),
    new PurifyCSSPlugin({
      paths: glob.sync(
        path.join(process.cwd(), "src/app/**/*.pug"),
        path.join(process.cwd(), "src/app/**/*.html")
      ),
      minimize: true,
      purifyOptions: {
        whitelist: ["*swal2*", "mark", "*simple-notification*"]
      }
    }),
    new webpack.DefinePlugin({
      "process.env": {
        "ENV": JSON.stringify("production")
      }
    })
  ]
};
