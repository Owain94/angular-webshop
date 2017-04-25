import { NgModule, ApplicationRef, APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';

import { ServerTransferStateModule } from './transfer-state/server-transfer-state.module';
import { AppModule } from './app.module';

import { TransferState } from './transfer-state/transfer-state';

import { MainComponent } from '../components/main/main.component';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';

export function onBootstrap(applicationRef: ApplicationRef, transferState: TransferState) {
  return () => {
    applicationRef.isStable
      .filter(stable => stable)
      .first()
      .subscribe(() => {
        transferState.inject();
      });
  };
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
        appId: 'inkies'
    }),
    ServerModule,
    ServerTransferStateModule,
    AppModule
  ],
  bootstrap: [
    MainComponent
  ],
  providers: [
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: onBootstrap,
      multi: true,
      deps: [
        ApplicationRef,
        TransferState
      ]
    }
  ]
})
export class AppServerModule { }
