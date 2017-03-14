# AngularCliUniversal

[![Build Status](https://travis-ci.org/Owain94/angular-cli-universal.svg?branch=master)](https://travis-ci.org/Owain94/angular-cli-universal)
[![Greenkeeper badge](https://badges.greenkeeper.io/Owain94/angular-cli-universal.svg)](https://greenkeeper.io/)
[![dependencies Status](https://david-dm.org/Owain94/angular-cli-universal/status.svg)](https://david-dm.org/Owain94/angular-cli-universal)
[![devDependencies Status](https://david-dm.org/Owain94/angular-cli-universal/dev-status.svg)](https://david-dm.org/Owain94/angular-cli-universal?type=dev)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c94a312a55e84c47aac183db4bbdf534)](https://www.codacy.com/app/Owain94/angular-cli-universal?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Owain94/angular-cli-universal&amp;utm_campaign=Badge_Grade)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-rc.1.

## Development mode
* Terminal 1: ```npm run watch:all```
* Wait for the build to finish
* Terminal 2: ```npm run server```

## Build with AoT

```
npm run build:all:aot
npm run server
```

## Build with AoT and serviceworker

Add this script to the body of your index.html
```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('Service Worker registered');
    }).catch(function(err) {
      console.log('Service Worker registration failed: ', err);
    });
  }
</script>
```

And run these commands

```
npm run build:all:aot
npm run sw
npm run server
```

Based on and huge thanks to [@FrozenPandaz][1]: [FrozenPandaz/ng-universal-demo][2]

Based on and huge thanks to [@robwormald][3]: [robwormald/ng-universal-demo][4]

[1]: https://github.com/FrozenPandaz
[2]: https://github.com/FrozenPandaz/ng-universal-demo
[3]: https://github.com/robwormald/
[4]: https://github.com/robwormald/ng-universal-demo
