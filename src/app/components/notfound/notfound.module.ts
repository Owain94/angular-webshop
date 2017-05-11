import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../main/header/header.module';

import { NotFoundComponent } from './notfound.component';

import { MetaService } from '../../services/meta.service';
import { AnalyticsService } from '../../services/analytics.service';

@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    HeaderModule,
    CommonModule,
    RouterModule.forChild(
      [
        {
          path: '',
          component: NotFoundComponent,
          pathMatch: 'full'
        }
      ]
    )
  ],
  providers: [
    MetaService,
    AnalyticsService
  ]
})
export class NotFoundModule {}
