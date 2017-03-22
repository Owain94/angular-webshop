const { AotPlugin } = require("@ngtools/webpack");

const tsConfig = {
  client: "./tsconfig.app.json",
  server: "./tsconfig.server.json"
};

const tsConfigAot = {
  client: "./tsconfig.app.json",
  server: "./tsconfig.server.aot.json"
};

const mainPath = {
  client: "./src/main.ts",
  server: "./src/app/app.server.module.ts#AppServerModule"
};

/**
 * Generates a AotPlugin for @ngtools/webpack
 *
 * @param {string} platform Should either be client or server
 * @param {boolean} aot Enables/Disables AoT Compilation
 * @returns
 */
function getAotPlugin(platform, aot) {
  return new AotPlugin({
    "mainPath": mainPath[platform],
    "tsConfigPath":aot ? tsConfigAot[platform] : tsConfig[platform],
    "skipCodeGeneration": !aot
  });
}

module.exports = {
  getAotPlugin
};
