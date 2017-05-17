const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");
const postcssUrl = require("postcss-url");
const PurifyCSSPlugin = require("purifycss-webpack");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const { NoEmitOnErrorsPlugin } = require("webpack");

/**
 * This is a prod config to be merged with the Client config
 */
module.exports = {
  "plugins": [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      "output": {
        "comments": false
      },
      "mangle": {
        "keep_fnames": true,
        "screw_ie8": true
      },
      "compress": {
        "warnings" : false,
        "conditionals": true,
        "unused": true,
        "comparisons": true,
        "sequences": true,
        "dead_code": true,
        "evaluate": true,
        "if_return": true,
        "join_vars": true,
        "negate_iife": false,
        "screw_ie8": true
      }
    }),
    new PurifyCSSPlugin({
      "paths": glob.sync(
        path.join(process.cwd(), "src/app/**/*.pug"),
        path.join(process.cwd(), "src/app/**/*.html")
      ),
      "minimize": true,
      "purifyOptions": {
        "whitelist": ["*swal2*", "mark", "*simple-notification*"]
      }
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new FaviconsWebpackPlugin({
      appName: "Inkie's",
      appDescription: "Inkie's webshop",
      developerName: "Owain van Brakel",
      developerURL: "https://www.owain.nl",
      background: "#ea4c88",
      theme_color: "#ea4c88",
      display: "standalone",
      version: "1.0",
      logging: false,
      online: false,
      preferOnline: false,
      start_url: "/",
      logo: "src/assets/img/icon.png",
      prefix: "icons/",
      emitStats: false,
      persistentCache: true,
      inject: true,
      title: "Inkie's",
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: true,
        twitter: true,
        yandex: true,
        windows: true
      }
    })
  ]
};
