import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppModule } from './app.module';
import { BrowserTransferStateModule } from './transfer-state/browser-transfer-state.module';

import { MainComponent } from '../components/main/main.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({
        appId: 'inkies'
    }),
    BrowserTransferStateModule,
    AppModule
  ],
  bootstrap: [
    MainComponent
  ]
})
export class AppBrowserModule {}
