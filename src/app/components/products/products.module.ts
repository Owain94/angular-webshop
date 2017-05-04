import { NgModule } from '@angular/core';
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
    MetaService,
    CartService,
    AnalyticsService
  ]
})
export class ProductsModule {}
