import { bootloader } from './bootloader';
import 'zone.js/dist/zone';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppBrowserModule } from './app/modules/app.browser.module';
import { environment } from './environments/environment';

if (process.env.ENV === 'production') {
  enableProdMode();
}

const bootstrap = () => {
  return platformBrowserDynamic().bootstrapModule(AppBrowserModule);
};

bootloader(bootstrap);
