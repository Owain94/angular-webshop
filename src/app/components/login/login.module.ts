import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../header/header.module';

import { LoginComponent } from './login.component';

import { UserService } from '../../services/user.service';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    HeaderModule,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(
      [
        {
          path: '',
          component: LoginComponent,
          pathMatch: 'full'
        }
      ]
    )
  ],
  providers: [
    UserService
  ]
})
export class LoginModule {}
