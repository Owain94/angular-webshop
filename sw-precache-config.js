module.exports = {
  navigateFallback: "/index.html",
  stripPrefix: "dist",
  root: "dist/",
  staticFileGlobs: [
    "dist/**/*.js",
    "dist/**/*.css",
    "dist/**/*.png",
    "dist/**/*.ico",
    "dist/**/*.svg",
    "dist/**/*.json",
    "dist/**/*.xml",
    "dist/**/*.webapp",
    "dist/**/*.eot",
    "dist/**/*.ttf",
    "dist/**/*.woff",
    "dist/assets/**/*"
  ],
  runtimeCaching: [{
    urlPattern: /http/,
    handler: "networkFirst"
  }]
};
