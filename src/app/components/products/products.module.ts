import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../main/header/header.module';
import { FilterPipeModule } from '../../pipes/pipe.filter.module';
import { HighlightPipeModule } from '../../pipes/highlight.pipe.module';
import { FixCurrencyPipeModule } from '../../pipes/fix.currency.pipe.module';

import { ProductsComponent } from './products.component';
import { ProductComponent } from './product/product.component';

import { MetaService } from '../../services/meta.service';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductComponent
  ],
  imports: [
    HeaderModule,
    FilterPipeModule,
    HighlightPipeModule,
    FixCurrencyPipeModule,

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
    MetaService
  ]
})
export class ProductsModule {}
