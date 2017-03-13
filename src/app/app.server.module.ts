import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';

import { ServerTransferStateModule } from './modules/transfer-state/server-transfer-state.module';
import { AppModule } from './app.module';

import { TransferState } from './modules/transfer-state/transfer-state';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
        appId: 'cli-universal'
    }),
    ServerModule,
    ServerTransferStateModule,
    AppModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppServerModule {

  constructor(private transferState: TransferState) { }

  // Gotcha
  ngOnBootstrap = () => {
    this.transferState.inject();
  }
}
