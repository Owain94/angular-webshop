const path = require("path");
const glob = require("glob");
const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");

/**
 * This is a client prod config which should be merged on top of common config
 */
module.exports = {
  "plugins": [
    new CompressionPlugin({
      "asset": "[path].gz[query]",
      "algorithm": "gzip",
      "test": /\.js$|\.css$/,
      "threshold": 1024,
      "minRatio": 0.8
    }),
    new BrotliPlugin({
      "asset": "[path].br[query]",
      "test": /\.js$|\.css$/,
      "threshold": 1024,
      "minRatio": 0.8
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
    new FaviconsWebpackPlugin({
      "appName": "Inkie's",
      "appDescription": "Inkie's webshop",
      "developerName": "Owain van Brakel",
      "developerURL": "https://www.owain.nl",
      "background": "#ea4c88",
      "theme_color": "#ea4c88",
      "display": "standalone",
      "version": "1.0",
      "logging": false,
      "online": false,
      "preferOnline": false,
      "start_url": "/",
      "logo": "src/assets/img/icon.png",
      "prefix": "icons/",
      "emitStats": false,
      "persistentCache": true,
      "inject": true,
      "title": "Inkie's",
      "icons": {
        "android": true,
        "appleIcon": true,
        "appleStartup": false,
        "coast": false,
        "favicons": true,
        "firefox": true,
        "opengraph": true,
        "twitter": true,
        "yandex": true,
        "windows": true
      }
    })
  ]
};
