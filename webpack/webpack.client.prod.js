const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require('brotli-webpack-plugin');

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
    })
  ]
};
