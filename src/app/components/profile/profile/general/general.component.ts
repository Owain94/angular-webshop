/// <reference path="../../../../interfaces/generic.interface.ts" />
/// <reference path="../../../../interfaces/user/profile.interface.ts" />

import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AutoUnsubscribe } from '../../../../decorators/auto.unsubscribe.decorator';

import { UserService } from '../../../../services/user.service';
import { MetaService } from '../../../../services/meta.service';
import { NotificationsService } from '../../../../services/notifications.service';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-profile-general',
  templateUrl: './general.component.pug'
})

@AutoUnsubscribe()
export class ProfileGeneralComponent implements OnInit {

  // tslint:disable-next-line:no-inferrable-types
  public disabledProfileForm: boolean = false;

  public profileForm: FormGroup;

  private profileDataSubscription: Subscription;
  private saveProfileDataSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private notificationsService: NotificationsService) {

  }

  ngOnInit(): void {
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

    this.profileDataSubscription = this.userService.profileData()
      .subscribe((res:  profileInterface.RootObject) => {
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
    this.notificationsService.info('Opslaan...', 'Even geduld alstublieft!');
    this.disabledProfileForm = true;

    this.saveProfileDataSubscription = this.userService.saveProfileData(value).subscribe(
      (res: genericInterface.RootObject) => {
        this.disabledProfileForm = false;

        if (res.error === 'false') {
          this.notificationsService.success('Succesvol!', res.data);
        } else {
          this.notificationsService.error('Onsuccesvol!', res.data);
        }
      });
  }
}
