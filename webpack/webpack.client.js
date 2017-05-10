const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");

const { CommonsChunkPlugin } = require("webpack").optimize;

const nodeModules = path.join(process.cwd(), "node_modules");
const entryPoints = ["inline","polyfills","sw-register","styles","vendor","main"];

/**
 * This is a client config which should be merged on top of common config
 */
module.exports = {
  "entry": {
    "main": [
      "./src/bootstrap/main.ts"
    ],
    "polyfills": [
      "./src/polyfills/polyfills.browser.ts"
    ],
    "styles": [
      "./src/assets/css/foundation.css",
      "./src/assets/css/styles.styl",
      "./node_modules/sweetalert2/dist/sweetalert2.min.css"
    ]
  },
  "output": {
    "path": path.join(process.cwd(), "dist"),
    "filename": "[name].bundle.js",
    "chunkFilename": "[id].chunk.js"
  },
  "target": "web",
  "plugins": [
    new HtmlWebpackPlugin({
      "template": "./src/index.pug",
      "filename": "./index.html",
      "hash": false,
      "inject": true,
      "compile": true,
      "favicon": false,
      "minify": {
        "collapseWhitespace": true
      },
      "cache": true,
      "showErrors": true,
      "chunks": "all",
      "excludeChunks": [],
      "chunksSortMode": function sort(left, right) {
        let leftIndex = entryPoints.indexOf(left.names[0]);
        let rightindex = entryPoints.indexOf(right.names[0]);
        if (leftIndex > rightindex) {
            return 1;
        } else if (leftIndex < rightindex) {
            return -1;
        } else {
            return 0;
        }
      }
    }),
    new ScriptExtHtmlWebpackPlugin({
      "async": "main"
    }),
    new CommonsChunkPlugin({
      "name": "inline",
      "minChunks": null
    }),
    new CommonsChunkPlugin({
      "name": "vendor",
      "minChunks": (module) => module.resource && module.resource.startsWith(nodeModules),
      "chunks": [
        "main"
      ]
    })
  ]
};
