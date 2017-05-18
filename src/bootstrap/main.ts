import { bootloader } from './../helpers/bootloader';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppBrowserModule } from './../app/modules/app.browser.module';

if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}

const bootstrap = () => {
  return platformBrowserDynamic().bootstrapModule(AppBrowserModule);
};

bootloader(bootstrap);
