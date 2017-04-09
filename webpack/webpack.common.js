const path = require("path");
const glob = require("glob");
const ProgressPlugin = require("webpack/lib/ProgressPlugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const url = require("postcss-url");
const webpack = require("webpack");

const { LoaderOptionsPlugin } = require("webpack");
const { GlobCopyWebpackPlugin, BaseHrefWebpackPlugin } = require("@angular/cli/plugins/webpack");
const { AotPlugin } = require("@ngtools/webpack");

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
        "loader": "file-loader?name=[name].[ext]"
      },
      {
        "test": /\.(jpg|png|gif|otf|ttf|woff|woff2|cur|ani)$/,
        "loader": "url-loader?name=[name].[ext]&limit=10000"
      },
      {
        "test": /\.ts$/,
        "loader": "@ngtools/webpack"
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/assets/css/foundation.css"),
          path.join(process.cwd(), "src/styles.css"),
          path.join(process.cwd(), "node_modules/sweetalert2/dist/sweetalert2.min.css")
        ],
        "test": /\.css$/,
        "loaders": [
          "exports-loader?module.exports.toString()",
          "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
          "postcss-loader"
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/assets/css/foundation.css"),
          path.join(process.cwd(), "src/styles.css"),
          path.join(process.cwd(), "node_modules/sweetalert2/dist/sweetalert2.min.css")
        ],
        "test": /\.scss$|\.sass$/,
        "loaders": [
          "exports-loader?module.exports.toString()",
          "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/assets/css/foundation.css"),
          path.join(process.cwd(), "src/styles.css"),
          path.join(process.cwd(), "node_modules/sweetalert2/dist/sweetalert2.min.css")
        ],
        "test": /\.less$/,
        "loaders": [
          "exports-loader?module.exports.toString()",
          "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
          "postcss-loader",
          "less-loader"
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/assets/css/foundation.css"),
          path.join(process.cwd(), "src/styles.css"),
          path.join(process.cwd(), "node_modules/sweetalert2/dist/sweetalert2.min.css")
        ],
        "test": /\.styl$/,
        "loaders": [
          "exports-loader?module.exports.toString()",
          "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
          "postcss-loader",
          "stylus-loader?{\"sourceMap\":false,\"paths\":[]}"
        ]
      },
      {
        "include": [
          path.join(process.cwd(), "src/assets/css/foundation.css"),
          path.join(process.cwd(), "src/styles.css"),
          path.join(process.cwd(), "node_modules/sweetalert2/dist/sweetalert2.min.css")
        ],
        "test": /\.css$/,
        "loaders": ExtractTextPlugin.extract({
          "use": [
            "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
            "postcss-loader"
          ],
          "fallback": "style-loader",
          "publicPath": ""
        })
      },
      {
        "include": [
          path.join(process.cwd(), "src/assets/css/foundation.css"),
          path.join(process.cwd(), "src/styles.css"),
          path.join(process.cwd(), "node_modules/sweetalert2/dist/sweetalert2.min.css")
        ],
        "test": /\.scss$|\.sass$/,
        "loaders": ExtractTextPlugin.extract({
          "use": [
            "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
            "postcss-loader",
            "sass-loader"
          ],
          "fallback": "style-loader",
          "publicPath": ""
        })
      },
      {
        "include": [
          path.join(process.cwd(), "src/assets/css/foundation.css"),
          path.join(process.cwd(), "src/styles.css"),
          path.join(process.cwd(), "node_modules/sweetalert2/dist/sweetalert2.min.css")
        ],
        "test": /\.less$/,
        "loaders": ExtractTextPlugin.extract({
          "use": [
            "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
            "postcss-loader",
            "less-loader"
          ],
          "fallback": "style-loader",
          "publicPath": ""
        })
      },
      {
        "include": [
          path.join(process.cwd(), "src/assets/css/foundation.css"),
          path.join(process.cwd(), "src/styles.css"),
          path.join(process.cwd(), "node_modules/sweetalert2/dist/sweetalert2.min.css")
        ],
        "test": /\.styl$/,
        "loaders": ExtractTextPlugin.extract({
          "use": [
            "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
            "postcss-loader",
            "stylus-loader?{\"sourceMap\":false,\"paths\":[]}"
          ],
          "fallback": "style-loader",
          "publicPath": ""
        })
      }
    ]
  },
  "plugins": [
    new LoaderOptionsPlugin({
      "sourceMap": false,
      "options": {
        "postcss": [
          autoprefixer(),
          postcss()
            .use(
                url(
                  [
                    {
                      filter: "*", url: (URL) => {
                        if (!URL.startsWith("/")) {
                          return URL;
                        }
                        return `${URL}`.replace(/\/\/+/g, "/");
                      }
                    }
                  ]
                )
            )
        ],
        "sassLoader": {
          "sourceMap": false,
          "includePaths": []
        },
        "lessLoader": {
          "sourceMap": false
        },
        "context": ""
      }
    }),
    new GlobCopyWebpackPlugin({
      "patterns": [
        "assets",
        "favicon.ico"
      ],
      "globOptions": {
        "cwd": path.join(process.cwd(), "src"),
        "dot": true,
        "ignore": "**/.gitkeep"
      }
    }),
    new ProgressPlugin(),
    new BaseHrefWebpackPlugin({}),
    new ExtractTextPlugin({
      "filename": "[name].bundle.css",
      "allChunks": true
    }),
    new PurifyCSSPlugin({
      paths: glob.sync(
        path.join(process.cwd(), "src/app/**/*.html")
      ),
      minimize: true,
      purifyOptions: {
        whitelist: ["*swal2*", "mark"]
      }
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
