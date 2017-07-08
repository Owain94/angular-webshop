import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../main/header/header.module';
import { FixCurrencyPipeModule } from '../../pipes/fix.currency.pipe.module';

import { CartComponent } from './cart.component';

import { MetaService } from '../../services/meta.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { AnalyticsService } from '../../services/analytics.service';

import * as Raven from 'raven-js';

Raven
  .config('https://03d884b718be42638de950df2a94a5d3@sentry.io/189340')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err.originalError);
  }
}

export function provideErrorHandler() {
  if (process.env.NODE_ENV === 'production') {
    return new RavenErrorHandler();
  } else {
    return new ErrorHandler();
  }
}

@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    HeaderModule,
    FixCurrencyPipeModule,

    CommonModule,
    RouterModule.forChild(
      [
        {
          path: '',
          component: CartComponent,
          pathMatch: 'full'
        }
      ]
    )
  ],
  providers: [
    {
      provide: ErrorHandler,
      useFactory: provideErrorHandler
    },
    MetaService,
    CartService,
    ProductService,
    AnalyticsService
  ]
})
export class CartModule {}
