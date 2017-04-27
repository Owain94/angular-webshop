/// <reference path="../../../../interfaces/generic.interface.ts" />

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AutoUnsubscribe } from '../../../../decorators/auto.unsubscribe.decorator';

import { UserService } from '../../../../services/user.service';
import { NotificationsService } from '../../../../services/notifications.service';

import { PasswordValidator } from '../../../../helpers/password.validator';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-profile-passwword',
  templateUrl: './password.component.pug'
})

@AutoUnsubscribe()
export class ProfilePasswordComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line:no-inferrable-types
  public disabledPasswordForm: boolean = false;

  public passwordForm: FormGroup;

  private saveProfileDataSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private notificationsService: NotificationsService) {

  }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      'old_password': [null, [Validators.required, Validators.minLength(6)]],
      'password': [null, [Validators.required, Validators.minLength(6)]],
      'password_confirm': [null, [Validators.required, Validators.minLength(6)]]
    });

    this.passwordForm.setValidators(PasswordValidator.mismatchedPasswords());
  }

  ngOnDestroy(): void {
    // pass
  }

  public submitPasswordForm(value: Object): void {
    this.notificationsService.info('Opslaan...', 'Even geduld alstublieft!');
    this.disabledPasswordForm = true;

    this.saveProfileDataSubscription = this.userService.saveProfilePassword(value).subscribe(
      (res: genericInterface.RootObject) => {
        this.disabledPasswordForm = false;

        if (res.error === 'false') {
          this.notificationsService.success('Succesvol!', res.data);

          this.passwordForm = this.formBuilder.group({
            'old_password': [null, [Validators.required, Validators.minLength(6)]],
            'password': [null, [Validators.required, Validators.minLength(6)]],
            'password_confirm': [null, [Validators.required, Validators.minLength(6)]]
          });
        } else {
          this.notificationsService.error('Onsuccesvol!', res.data);
        }
      });
  }
}
