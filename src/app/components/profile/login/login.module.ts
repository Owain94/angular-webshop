import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../../main/header/header.module';

import { LoginComponent } from './login.component';

import { UserService } from '../../../services/user.service';
import { MetaService } from '../../../services/meta.service';

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
    UserService,
    MetaService
  ]
})
export class LoginModule {}
