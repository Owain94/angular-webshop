import { NgModule, RendererFactory2 } from '@angular/core';
import { PlatformState } from '@angular/platform-server';

import { TransferState } from './transfer-state';

export function getTransferState(): TransferState {
  const transferState = new TransferState();
  transferState.initialize(window['TRANSFER_STATE'] || {});
  return transferState;
}

@NgModule({
  providers: [
    {
      provide: TransferState,
      useFactory: getTransferState
    }
  ]
})
export class BrowserTransferStateModule {}
