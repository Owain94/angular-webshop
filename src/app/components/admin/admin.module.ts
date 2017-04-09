import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderModule } from '../main/header/header.module';
import { FilterPipeModule } from '../../pipes/pipe.filter.module';
import { HighlightPipeModule } from '../../pipes/highlight.pipe.module';
import { ImageCropperModule } from 'ng2-img-cropper';

import { AdminComponent } from './admin.component';
import { AdminCategoriesComponent } from './categories/categories.component';
import { AdminProductsComponent } from './products/products.component';
import { AdminAddProductComponent } from './products/add/add.product.component';
import { AdminEditProductComponent } from './products/edit/edit.product.component';


import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';

import { AdminGuard } from '../../guards/admin.guard';

const routes: Routes =
  [
    {
      path: '',
      component: AdminComponent,
      children: [
        {
          path: '',
          redirectTo: 'categories',
          pathMatch: 'full'
        },
        {
          path: 'categories',
          component: AdminCategoriesComponent
        },
        {
          path: 'products',
          component: AdminProductsComponent
        },
        {
          path: 'addproduct',
          component: AdminAddProductComponent
        },
        {
          path: 'editproduct/:id',
          component: AdminEditProductComponent
        }
      ]
    }
  ];

@NgModule({
  declarations: [
    AdminComponent,
    AdminCategoriesComponent,
    AdminProductsComponent,
    AdminAddProductComponent,
    AdminEditProductComponent
  ],
  imports: [
    HeaderModule,
    FilterPipeModule,
    HighlightPipeModule,

    ImageCropperModule,

    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(
      routes
    )
  ],
  providers: [
    ProductService,
    UserService,
    AdminService,
    AdminGuard
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule {}
