import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { LocalStorageService } from '../../../services/localstorage.service';

import { AuthGuard } from '../../../guards/auth.guard';

import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-inferrable-types
  public disabled: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public tfa: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public msg: string = '';
  public loginForm: FormGroup;

  private emailSubscription: Subscription;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private authGuard: AuthGuard,
              private localStorageService: LocalStorageService) {

  }

  ngOnInit(): void {
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
            this.userService.checkTfa(input).subscribe(
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

  ngOnDestroy(): void {
    try {
      this.emailSubscription.unsubscribe();
    } catch (err) {}
  }

  public submitForm(value: Object): void {
    this.disabled = true;
    this.userService.login(value).subscribe(
      (res: any) => {
        this.disabled = false;
        if (res.error === 'false') {
          this.localStorageService.set('user', JSON.stringify({ token: res.data }));
          this.router.navigateByUrl('/');
        } else {
          this.msg = res.msg;
        }
      });
  }
}
