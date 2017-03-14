const ngtools = require("@ngtools/webpack");
const webpackMerge = require("webpack-merge");
const commonPartial = require("./webpack/webpack.common");
const clientPartial = require("./webpack/webpack.client");
const serverPartial = require("./webpack/webpack.server");
const prodPartial = require("./webpack/webpack.prod");
const { getAotPlugin } = require("./webpack/webpack.aot");

module.exports = function (options, webpackOptions) {
  options = options || {};

  console.log(`Running build for ${options.client ? "client" : "server"} with ${options.aot ? "AoT" : "JiT"} compilation`);

  let serverConfig = webpackMerge({}, commonPartial, serverPartial, {
    entry: options.aot ? "./src/main.server.aot.ts" : serverPartial.entry.main, // Temporary
    plugins: [
      getAotPlugin("server", !!options.aot)
    ]
  });

  let clientConfig = webpackMerge({}, commonPartial, clientPartial, {
    plugins: [
      getAotPlugin("client", !!options.aot)
    ]
  });

  if (options.aot) {
    clientConfig = webpackMerge({}, clientConfig, prodPartial);
    serverConfig = webpackMerge({}, serverConfig, prodPartial);
  }

  const configs = [];
  if (options.client) {
    configs.push(clientConfig);
  } else if (options.server) {
    configs.push(serverConfig);
  }

  return configs;
};
