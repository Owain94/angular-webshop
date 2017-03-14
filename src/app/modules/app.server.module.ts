import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';

import { ServerTransferStateModule } from './transfer-state/server-transfer-state.module';
import { AppModule } from './app.module';

import { TransferState } from './transfer-state/transfer-state';

import { MainComponent } from '../components/main/main.component';

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
    MainComponent
  ]
})
export class AppServerModule {

  constructor(private transferState: TransferState) { }

  // Gotcha
  ngOnBootstrap = () => {
    this.transferState.inject();
  }
}
