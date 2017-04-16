import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../main/header/header.module';

import { CartComponent } from './cart.component';

import { MetaService } from '../../services/meta.service';

@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    HeaderModule,
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
    MetaService
  ]
})
export class CartModule {}
