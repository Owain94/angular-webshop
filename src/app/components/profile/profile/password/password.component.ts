/// <reference path="../../../../interfaces/generic.interface.ts" />

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Log } from '../../../../decorators/log.decorator';
import { AutoUnsubscribe } from '../../../../decorators/auto.unsubscribe.decorator';

import { UserService } from '../../../../services/user.service';
import { NotificationsService } from '../../../../services/notifications.service';
import { AnalyticsService } from '../../../../services/analytics.service';

import { mismatchedPasswords } from '../../../../helpers/password.validator';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-profile-passwword',
  templateUrl: './password.component.pug',
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
export class ProfilePasswordComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line:no-inferrable-types
  public disabledPasswordForm: boolean = false;

  public passwordForm: FormGroup;

  private saveProfileDataSubscription: Subscription;
  private analyticSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private notificationsService: NotificationsService) {

  }

  ngOnInit(): void {
    this.initForm();

    this.analyticSubscription = this.analyticsService.visit('ProfilePassword').subscribe();
  }

  ngOnDestroy(): void {
    // pass
  }

  private initForm(): void {
    this.passwordForm = this.formBuilder.group({
      'old_password': [null, [Validators.required, Validators.minLength(6)]],
      'password': [null, [Validators.required, Validators.minLength(6)]],
      'password_confirm': [null, [Validators.required, Validators.minLength(6), mismatchedPasswords('password')]]
    });
  }

  public submitPasswordForm(value: Object): void {
    this.notificationsService.info('Opslaan...', 'Even geduld alstublieft!');
    this.disabledPasswordForm = true;

    this.saveProfileDataSubscription = this.userService.saveProfilePassword(value).subscribe(
      (res: genericInterface.RootObject) => {
        this.disabledPasswordForm = false;

        if (res.error === 'false') {
          this.notificationsService.success('Succesvol!', 'Uw wachtwoord is succesvol geüpdatet!');
          this.initForm();
        } else {
          this.notificationsService.error('Onsuccesvol!', res.msg);
        }
      });
  }
}
