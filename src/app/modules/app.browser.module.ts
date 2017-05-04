import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppModule } from './app.module';
import { ServerTransition } from './routing/server-transition.module';
import { BrowserTransferStateModule } from './transfer-state/browser-transfer-state.module';

import { MainComponent } from '../components/main/main.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule/*.withServerTransition({
        appId: 'inkies'
    })*/,
    // TODO:Remove this when the angular team fixes this
    ServerTransition.forRoot({
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
