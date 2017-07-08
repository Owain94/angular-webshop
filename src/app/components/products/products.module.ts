import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../main/header/header.module';
import { HighlightPipeModule } from '../../pipes/highlight.pipe.module';
import { FixCurrencyPipeModule } from '../../pipes/fix.currency.pipe.module';
import { NotificationsModule } from '../notification/notification.module';

import { ProductsComponent } from './products.component';
import { ProductComponent } from './product/product.component';

import { MetaService } from '../../services/meta.service';
import { CartService } from '../../services/cart.service';
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
    ProductsComponent,
    ProductComponent
  ],
  imports: [
    HeaderModule,
    HighlightPipeModule,
    FixCurrencyPipeModule,
    NotificationsModule,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(
      [
        {
          path: '',
          component: ProductsComponent,
          pathMatch: 'full'
        },
        {
          path: 'product/:id',
          component: ProductComponent
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
    AnalyticsService
  ]
})
export class ProductsModule {}
