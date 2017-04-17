import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../main/header/header.module';
import { FixCurrencyPipeModule } from '../../pipes/fix.currency.pipe.module';

import { CartComponent } from './cart.component';

import { MetaService } from '../../services/meta.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

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
    MetaService,
    CartService,
    ProductService
  ]
})
export class CartModule {}
