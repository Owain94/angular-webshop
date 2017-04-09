module.exports = {
  navigateFallback: "/index.html",
  stripPrefix: "dist",
  root: "dist/",
  staticFileGlobs: [
    "dist/0.chunk.js",
    "dist/1.chunk.js",
    "dist/2.chunk.js",
    "dist/3.chunk.js",
    "dist/4.chunk.js",
    "dist/5.chunk.js",
    "dist/inline.bundle.js",
    "dist/main.bundle.js",
    "dist/polyfills.bundle.js",
    "dist/vendor.bundle.js",
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
    handler: 'networkFirst'
  }]
};
