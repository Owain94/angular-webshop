import { Subject } from 'rxjs/Rx';
import { AuthGuard } from './../../guards/auth.guard';
import { Router } from '@angular/router';
import { PostalcodeService } from './../../services/postalcode.service';
import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  AbstractControl,
  ValidatorFn,
  FormGroup
} from '@angular/forms';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  // tslint:disable-next-line:no-inferrable-types
  public disabled: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public msg: string = '';
  public profileForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router,
              private authGuard: AuthGuard) {

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

  public submitForm(value: Object): void {
    this.disabled = true;

    this.userService.saveProfileData(value).subscribe(
      (res: any) => {
        this.disabled = false;

        if (res.error === 'false') {
          this.msg = 'Uw account is succesvol geüpdatet!';
        } else {
          this.msg = res.msg;
        }
      });
  }
}
