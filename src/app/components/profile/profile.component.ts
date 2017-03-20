import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Validators,
  FormBuilder,
  AbstractControl,
  ValidatorFn,
  FormGroup
} from '@angular/forms';

import { UserService } from '../../services/user.service';

import { PasswordValidator } from '../../helpers/password.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  // tslint:disable-next-line:no-inferrable-types
  public disabledProfileForm: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public disabledPasswordForm: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public msgProfile: string = '';
  // tslint:disable-next-line:no-inferrable-types
  public msgPassword: string = '';
  public profileForm: FormGroup;
  public passwordForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService) {

  }

  ngOnInit(): void {
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

    this.userService.profileData()
      .subscribe((res) => {
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
      (res: any) => {
        this.disabledProfileForm = false;

        if (res.error === 'false') {
          this.msgProfile = 'Uw account is succesvol geüpdatet!';
        } else {
          this.msgProfile = res.msg;
        }
      });
  }

  public submitPasswordForm(value: Object): void {
    this.disabledPasswordForm = true;

    this.userService.saveProfilePassword(value).subscribe(
      (res: any) => {
        this.disabledPasswordForm = false;

        if (res.error === 'false') {
          this.msgPassword = 'Uw wachtwoord is succesvol geüpdatet!';
        } else {
          this.msgPassword = res.msg;
        }
      });
  }
}
