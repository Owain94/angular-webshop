import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RoutingModule } from './routing/routing.module';
import { TransferHttpModule } from './transfer-http/transfer-http.module';

import { HeaderModule } from '../components/header/header.module';

import { MainComponent } from '../components/main/main.component';
import { MenuComponent } from '../components/menu/menu.component';
import { FooterComponent } from '../components/footer/footer.component';
import { HomeComponent } from '../components/home/home.component';

import { UserService } from '../services/user.service';

import { AuthGuard } from '../guards/auth.guard';

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
    UserService,
    AuthGuard
  ],
  exports: [
    MainComponent
  ]
})
export class AppModule {}
