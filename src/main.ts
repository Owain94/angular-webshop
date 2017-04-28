import { bootloader } from './bootloader';

import 'zone.js/dist/zone';
import 'ric';
import 'web-animations-js';
import 'sweetalert2';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppBrowserModule } from './app/modules/app.browser.module';

if (process.env.ENV === 'production') {
  enableProdMode();
}

const bootstrap = () => {
  return platformBrowserDynamic().bootstrapModule(AppBrowserModule);
};

bootloader(bootstrap);
