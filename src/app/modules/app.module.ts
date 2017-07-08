import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RoutingModule } from './routing/routing.module';
import { TransferHttpModule } from './transfer-http/transfer-http.module';

import { HeaderModule } from '../components/main/header/header.module';

import { MainComponent } from '../components/main/main.component';
import { MenuComponent } from '../components/main/menu/menu.component';
import { FooterComponent } from '../components/main/footer/footer.component';
import { HomeComponent } from '../components/home/home.component';

import { LocalStorageService } from '../services/localstorage.service';
import { UserService } from '../services/user.service';
import { ContactService } from '../services/contact.service';
import { AdminService } from '../services/admin.service';
import { ProductService } from '../services/product.service';
import { MetaService } from '../services/meta.service';
import { AnalyticsService } from '../services/analytics.service';

import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

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
    MainComponent,
    MenuComponent,
    FooterComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    HttpModule,
    TransferHttpModule,
    RoutingModule,

    HeaderModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useFactory: provideErrorHandler
    },
    LocalStorageService,
    UserService,
    AdminService,
    ProductService,
    MetaService,
    AnalyticsService,
    ContactService,
    AuthGuard,
    AdminGuard
  ],
  exports: [
    MainComponent
  ]
})
export class AppModule {}
