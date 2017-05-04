/// <reference path="../../../../interfaces/generic.interface.ts" />
/// <reference path="../../../../interfaces/user/profile.interface.ts" />

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Log } from '../../../../decorators/log.decorator';
import { PageAnalytics } from '../../../../decorators/page.analytic.decorator';
import { AutoUnsubscribe } from '../../../../decorators/auto.unsubscribe.decorator';

import { UserService } from '../../../../services/user.service';
import { NotificationsService } from '../../../../services/notifications.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-profile-general',
  templateUrl: './general.component.pug',
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
@PageAnalytics('ProfileGeneral')
export class ProfileGeneralComponent implements OnInit, OnDestroy {

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
        const firstnameField = this.profileForm.get('firstname');
        const surnamePrefixField = this.profileForm.get('surname_prefix');
        const surnameField = this.profileForm.get('surname');
        const streetnameField = this.profileForm.get('streetname');
        const houseNumberField = this.profileForm.get('house_number');
        const postalCodeField = this.profileForm.get('postal_code');
        const cityField = this.profileForm.get('city');
        const countryField = this.profileForm.get('country');

        if (firstnameField) {
          firstnameField.setValue(res['data']['firstname']);
        }
        if (surnamePrefixField) {
          surnamePrefixField.setValue(res['data']['surname_prefix']);
        }
        if (surnameField) {
          surnameField.setValue(res['data']['surname']);
        }
        if (streetnameField) {
          streetnameField.setValue(res['data']['streetname']);
        }
        if (houseNumberField) {
          houseNumberField.setValue(res['data']['house_number']);
        }
        if (postalCodeField) {
          postalCodeField.setValue(res['data']['postal_code']);
        }
        if (cityField) {
          cityField.setValue(res['data']['city']);
        }
        if (countryField) {
          countryField.setValue(res['data']['country']);
        }
    });
  }

  ngOnDestroy(): void {
    // pass
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
