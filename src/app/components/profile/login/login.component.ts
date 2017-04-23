/// <reference path="../../../interfaces/generic.interface.ts" />

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { UserService } from '../../../services/user.service';
import { LocalStorageService } from '../../../services/localstorage.service';
import { MetaService } from '../../../services/meta.service';
import { NotificationsService } from '../../../services/notifications.service';

import { AuthGuard } from '../../../guards/auth.guard';

import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.pug'
})

@AutoUnsubscribe()
export class LoginComponent implements OnInit {
  // tslint:disable-next-line:no-inferrable-types
  public disabled: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public tfa: boolean = false;
  public loginForm: FormGroup;

  private emailSubscription: Subscription;
  private loginSubscription: Subscription;
  private checkTfaSubscription: Subscription;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private authGuard: AuthGuard,
              private localStorageService: LocalStorageService,
              private metaService: MetaService,
              private notificationsService: NotificationsService) {

  }

  ngOnInit(): void {
    this.metaService.addTags();

    if (this.authGuard.check()) {
      this.router.navigateByUrl('/');
    }

    this.loginForm = this.formBuilder.group({
      'email': [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      'password': [null, [Validators.required, Validators.minLength(6)]],
      'tfa': [null]
    });

    this.emailSubscription = this.loginForm.get('email').valueChanges
    .debounceTime(1000)
    .distinctUntilChanged()
    .subscribe(
      (input: string) => {
        const regexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
          if (regexp.test(input)) {
            this.checkTfaSubscription = this.userService.checkTfa(input).subscribe(
              (res: boolean) => {
                if (res) {
                  this.loginForm.get('tfa').setValidators(
                    Validators.compose(
                      [Validators.required, Validators.minLength(6), Validators.maxLength(6)]
                    )
                  );
                } else {
                  this.loginForm.get('tfa').clearValidators();
                }

                this.loginForm.get('tfa').updateValueAndValidity();
                this.tfa = res;
              }
            );
          }
      }
    );
  }

  public submitForm(value: Object): void {
    this.disabled = true;
    this.loginSubscription = this.userService.login(value).subscribe(
      (res: genericInterface.RootObject) => {
        this.disabled = false;
        if (res.error === 'false') {
          this.localStorageService.set('user', JSON.stringify({ token: res.data }));
          this.router.navigateByUrl('/');
        } else {
          this.notificationsService.error('Oeps!', res.msg);
        }
      });
  }
}
