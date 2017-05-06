/// <reference path="../../../interfaces/generic.interface.ts" />

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { Log } from '../../../decorators/log.decorator';
import { PageAnalytics } from '../../../decorators/page.analytic.decorator';
import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { UserService } from '../../../services/user.service';
import { PostalcodeService } from '../../../services/postalcode.service';
import { MetaService } from '../../../services/meta.service';
import { NotificationsService } from '../../../services/notifications.service';

import { AuthGuard } from '../../../guards/auth.guard';

import { PasswordValidator } from '../../../helpers/password.validator';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.pug',
  styleUrls: ['./register.component.styl'],
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
@PageAnalytics('Register')
export class RegisterComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-inferrable-types
  public disabled: boolean = false;
  public registerForm: FormGroup;

  private country: Subject<string> = new Subject();
  private countrySubscription: Subscription;
  private postalcodeDataSubscription: Subscription;
  private registerSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private postalcodeService: PostalcodeService,
              private userService: UserService,
              private router: Router,
              private authGuard: AuthGuard,
              private metaService: MetaService,
              private notificationsService: NotificationsService) {

  }

  ngOnInit(): void {
    this.metaService.addTags();

    if (this.authGuard.check()) {
      this.router.navigateByUrl('/');
    }

    this.registerForm = this.formBuilder.group({
      'firstname' : [null, Validators.required],
      'surname_prefix' : [null],
      'surname': [null, Validators.required],
      'streetname': [null, Validators.required],
      'house_number': [null, Validators.required],
      'postal_code': [null, Validators.required],
      'city': [null, Validators.required],
      'country': [null, Validators.required],
      'email': [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      'password': [null, [Validators.required, Validators.minLength(6)]],
      'password_confirm': [null, [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm.setValidators(PasswordValidator.mismatchedPasswords());
    this.registerForm.setValidators(this.postalcode());

    const countryField = this.registerForm.get('country');
    const postalCodeField = this.registerForm.get('postal_code');
    const streetnameField = this.registerForm.get('streetname');
    const cityField = this.registerForm.get('city');

    this.countrySubscription = this.country
      .distinctUntilChanged()
      .debounceTime(250)
      .subscribe((value) => {
        if (countryField) {
          countryField.setValue(value);
        }

        if (postalCodeField && value === 'Nederland') {
          this.postalcodeDataSubscription = this.postalcodeService.getPostalcodeData(
            postalCodeField.value.replace(' ', '')
          ).subscribe((data: [string, string]) => {
            if (streetnameField) {
              try {
                streetnameField.setValue(data[1]);
              } catch (err) {
              }
            }

            if (cityField) {
              try {
                cityField.setValue(data[0]);
              } catch (err) {
              }
            }
          });
        }
    });
  }

  ngOnDestroy(): void {
    // pass
  }

  private postalcode = (): ValidatorFn => {
    return (group: AbstractControl): { [key: string]: any } => {
      const postalcodeField = group.get('postal_code');

      const dutch = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
      const belgian = /^[1-9]{1}[0-9]{3}$/i;

      if (postalcodeField) {
        if (dutch.test(postalcodeField.value)) {
          this.country.next('Nederland');
          return { 'postalcodeInvalid': false };
        } else if (belgian.test(postalcodeField.value)) {
          this.country.next('België');
          return { 'postalcodeInvalid': false };
        }

        postalcodeField.setErrors({ 'postalcodeInvalid': true });
      }
      return { 'postalcodeInvalid': true };
    };
  }

  public submitForm(value: Object): void {
    this.notificationsService.info('Opslaan...', 'Even geduld alstublieft!');
    this.disabled = true;
    this.registerSubscription = this.userService.register(value).subscribe(
      (res: genericInterface.RootObject) => {
          this.disabled = false;

        if (res.error === 'false') {
          this.registerForm = this.formBuilder.group({
            'firstname' : [null, Validators.required],
            'surname_prefix' : [null],
            'surname': [null, Validators.required],
            'streetname': [null, Validators.required],
            'house_number': [null, Validators.required],
            'postal_code': [null, Validators.required],
            'city': [null, Validators.required],
            'country': [null, Validators.required],
            // tslint:disable-next-line:max-line-length
            'email': [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
            'password': [null, [Validators.required, Validators.minLength(6)]],
            'password_confirm': [null, [Validators.required, Validators.minLength(6)]]
          });
          this.notificationsService.success('Succesvol!', 'Uw account is succesvol aangemaakt!');
        } else {
          this.notificationsService.error('Onsuccesvol!', res.msg);
        }
      });
  }
}
