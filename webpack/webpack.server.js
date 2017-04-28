const path = require("path");
const webpack = require("webpack");

/**
 * This is a client config which should be merged on top of common config
 */
module.exports = {
  "entry": {
    "main": [
      "./src/bootstrap/main.server.ts"
    ]
  },
  "output": {
    "path": path.join(process.cwd(), "dist"),
    "filename": "[name].server.bundle.js",
    "chunkFilename": "[id].server.chunk.js"
  },
  "target": "node"
};
