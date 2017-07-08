import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderModule } from '../main/header/header.module';
import { HighlightPipeModule } from '../../pipes/highlight.pipe.module';
import { NotificationsModule } from '../notification/notification.module';
import { CountoModule } from '../../directives/counto.module';

import { ImageCropperModule } from 'ng2-img-cropper';
import { NgDateRangePickerModule } from 'ng-daterangepicker';
import { ChartsModule } from 'ng2-charts';

import { AdminComponent } from './admin.component';
import { AdminCategoriesComponent } from './categories/categories.component';
import { AdminProductsComponent } from './products/products.component';
import { AdminAddProductComponent } from './products/add/add.product.component';
import { AdminEditProductComponent } from './products/edit/edit.product.component';
import { AdminMessagesComponent } from './messages/messages.component';
import { AdminStatsComponent } from './stats/stats.component';

import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { ContactService } from '../../services/contact.service';
import { AdminService } from '../../services/admin.service';
import { MetaService } from '../../services/meta.service';
import { AnalyticsService } from '../../services/analytics.service';

import { AdminGuard } from '../../guards/admin.guard';

import * as Raven from 'raven-js';

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
        },
        {
          path: 'messages',
          component: AdminMessagesComponent
        },
        {
          path: 'stats',
          component: AdminStatsComponent
        }
      ]
    }
  ];

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
    AdminComponent,
    AdminCategoriesComponent,
    AdminProductsComponent,
    AdminAddProductComponent,
    AdminEditProductComponent,
    AdminMessagesComponent,
    AdminStatsComponent
  ],
  imports: [
    HeaderModule,
    HighlightPipeModule,
    NotificationsModule,
    CountoModule,

    ImageCropperModule,
    NgDateRangePickerModule,
    ChartsModule,

    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(
      routes
    )
  ],
  providers: [
    {
      provide: ErrorHandler,
      useFactory: provideErrorHandler
    },
    ProductService,
    UserService,
    ContactService,
    MetaService,
    AdminService,
    AdminGuard,
    AnalyticsService
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule {}
