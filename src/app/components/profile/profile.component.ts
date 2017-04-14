/// <reference path="../../interfaces/generic.interface.ts" />
/// <reference path="../../interfaces/user/tfa.token.interface.ts" />
/// <reference path="../../interfaces/user/profile.interface.ts" />

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AutoUnsubscribe } from '../../decorators/auto.unsubscribe.decorator';

import { UserService } from '../../services/user.service';
import { MetaService } from '../../services/meta.service';

import { PasswordValidator } from '../../helpers/password.validator';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.pug',
  styleUrls: ['./profile.component.css']
})

@AutoUnsubscribe()
export class ProfileComponent implements OnInit {
  @ViewChild('tfaToken') tfaToken: ElementRef;

  // tslint:disable-next-line:no-inferrable-types
  public disabledProfileForm: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public disabledPasswordForm: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public msgProfile: string = '';
  // tslint:disable-next-line:no-inferrable-types
  public msgPassword: string = '';
  // tslint:disable-next-line:no-inferrable-types
  public msgTfa: string = '';
  public twoFactorCode: string;
  public twoFactorKey: string;

  // tslint:disable-next-line:no-inferrable-types
  public twoFactorShow: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public twoFactorInitial: boolean = false;
  public profileForm: FormGroup;
  public passwordForm: FormGroup;

  private profileDataSubscription: Subscription;
  private saveProfileDataSubscription: Subscription;
  private tfaTokenSubscription: Subscription;
  private disableTfaSubscription: Subscription;
  private verifyTfaTokenSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private metaService: MetaService) {

  }

  ngOnInit(): void {
    this.metaService.addTags();
    this.userService.verifyLogout();

    this.profileForm = this.formBuilder.group({
      'firstname' : [null, Validators.required],
      'surname_prefix' : [null],
      'surname': [null, Validators.required],
      'streetname': [null, Validators.required],
      'house_number': [null, Validators.required],
      'postal_code': [null, Validators.required],
      'city': [null, Validators.required],
      'country': [null, Validators.required]
    });

    this.passwordForm = this.formBuilder.group({
      'old_password': [null, [Validators.required, Validators.minLength(6)]],
      'password': [null, [Validators.required, Validators.minLength(6)]],
      'password_confirm': [null, [Validators.required, Validators.minLength(6)]]
    });

    this.passwordForm.setValidators(PasswordValidator.mismatchedPasswords());

    this.profileDataSubscription = this.userService.profileData()
      .subscribe((res:  profileInterface.RootObject) => {
        this.twoFactorInitial = res.data.tfatoken.length > 0;

        if (this.twoFactorInitial) {
          this.twoFactorShow = true;
        }

        this.profileForm.get('firstname').setValue(res['data']['firstname']);
        this.profileForm.get('surname_prefix').setValue(res['data']['surname_prefix']);
        this.profileForm.get('surname').setValue(res['data']['surname']);
        this.profileForm.get('streetname').setValue(res['data']['streetname']);
        this.profileForm.get('house_number').setValue(res['data']['house_number']);
        this.profileForm.get('postal_code').setValue(res['data']['postal_code']);
        this.profileForm.get('city').setValue(res['data']['city']);
        this.profileForm.get('country').setValue(res['data']['country']);
    });
  }

  public submitProfileForm(value: Object): void {
    this.disabledProfileForm = true;

    this.userService.saveProfileData(value).subscribe(
      (res: genericInterface.RootObject) => {
        this.disabledProfileForm = false;
        this.msgProfile = res.data;
      });
  }

  public submitPasswordForm(value: Object): void {
    this.disabledPasswordForm = true;

    this.saveProfileDataSubscription = this.userService.saveProfilePassword(value).subscribe(
      (res: genericInterface.RootObject) => {
        this.disabledPasswordForm = false;
        this.msgPassword = res.data;
      });
  }

  public twoFactor(value: boolean): void {
    if (value) {
      if (!this.twoFactorCode) {
        this.tfaTokenSubscription = this.userService.tfaToken().subscribe(
          (res: tfaTokenInterface.RootObject) => {
            this.twoFactorKey = res.key;
            this.twoFactorCode = res.otpauth_url.replace('SecretKey', 'Inkies');
        });
      }
    }

    this.twoFactorShow = value;
  }

  public TfaSave(): void {
    if (this.twoFactorInitial && !this.twoFactorShow) {
      this.disableTfaSubscription = this.userService.disableTfa().subscribe(
        (res: boolean) => {
          if (res) {
            this.msgTfa = 'Two Factor authenticatie uitgeschakeld!';
            this.twoFactorInitial = false;
          } else {
            this.msgTfa = 'Een onbekende fout is opgetreden, probeer het later nog eens.';
          }
        }
      );
      return;
    }
    const token: string = this.tfaToken.nativeElement.value;

    if (token.length !== 6) {
      this.msgTfa = 'Foutieve token invoer!';
    } else {
      this.verifyTfaTokenSubscription = this.userService.verifyTfaToken(this.twoFactorKey, token).subscribe(
        (res: boolean) => {
          if (res) {
            this.msgTfa = 'Two Factor authenticatie ingeschakeld!';
          } else {
            this.msgTfa = 'Foutieve token invoer!';
          }
        }
      );
    }
  }
}
