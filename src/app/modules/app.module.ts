import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
import { AdminService } from '../services/admin.service';
import { ProductService } from '../services/product.service';
import { MetaService } from '../services/meta.service';
import { AnalyticsService } from '../services/analytics.service';

import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

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
    LocalStorageService,
    UserService,
    AdminService,
    ProductService,
    MetaService,
    AnalyticsService,
    AuthGuard,
    AdminGuard
  ],
  exports: [
    MainComponent
  ]
})
export class AppModule {}
