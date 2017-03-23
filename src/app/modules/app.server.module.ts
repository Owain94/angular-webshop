import { NgModule, ApplicationRef, APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';

import { ServerTransferStateModule } from './transfer-state/server-transfer-state.module';
import { AppModule } from './app.module';

import { TransferState } from './transfer-state/transfer-state';

import { MainComponent } from '../components/main/main.component';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';

export function boot(state: TransferState, applicationRef: ApplicationRef) {
  return function () {
    applicationRef.isStable
      .filter((stable: boolean) => stable)
      .first()
      .subscribe(() => {
        state.inject();
      });
  };
}

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
  ],
  providers: [
    {
      provide: APP_BOOTSTRAP_LISTENER,
      multi: true,
      useFactory: boot,
      deps: [
        TransferState,
        ApplicationRef
      ]
    }
  ]
})
export class AppServerModule { }
