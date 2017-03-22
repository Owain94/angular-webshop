import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  Validators,
  FormBuilder,
  AbstractControl,
  ValidatorFn,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

import { PasswordValidator } from '../../helpers/password.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
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
        this.twoFactorInitial = res['data']['tfatoken'].length > 0;

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

  public twoFactor(value: boolean): void {
    if (value) {
      if (!this.twoFactorCode) {
        this.userService.tfaToken().subscribe(
          (res: any) => {
            this.twoFactorKey = res.key;
            this.twoFactorCode = res.otpauth_url.replace('SecretKey', 'Inkies');
        });
      }
    }

    this.twoFactorShow = value;
  }

  public TfaSave() {
    if (this.twoFactorInitial && !this.twoFactorShow) {
      this.userService.disableTfa().subscribe(
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
      this.userService.verifyTfaToken(this.twoFactorKey, token).subscribe(
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
