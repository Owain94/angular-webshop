module.exports = {
  navigateFallback: "/index.html",
  stripPrefix: "dist",
  root: "dist/",
  staticFileGlobs: [
    "dist/**/*.js",
    "dist/**/*.html",
    "dist/**/*.css",
    "dist/**/*.ico",
    "dist/**/*.svg",
    "dist/**/*.eot",
    "dist/**/*.ttf",
    "dist/**/*.woff",
    "dist/**/*.ico",
    "dist/assets/**/*"
  ],
  runtimeCaching: [{
    urlPattern: /http/,
    handler: "networkFirst"
  }]
};
