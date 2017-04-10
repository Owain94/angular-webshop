import { NgModule } from '@angular/core';

import { FixCurrencyPipe } from './fix.currency.pipe';

@NgModule({
  declarations: [
    FixCurrencyPipe
  ],
  exports: [
    FixCurrencyPipe
  ]
})
export class FixCurrencyPipeModule {}
