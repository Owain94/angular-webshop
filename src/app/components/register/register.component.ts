import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';

import { AuthGuard } from '../../guards/auth.guard';
import { UserService } from '../../services/user.service';
import { PostalcodeService } from '../../services/postalcode.service';

import { PasswordValidator } from '../../helpers/password.validator';

import { Subject, Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-inferrable-types
  public disabled: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public msg: string = '';
  public registerForm: FormGroup;
  private country: Subject<string> = new Subject();
  private countrySubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private postalcodeService: PostalcodeService,
              private userService: UserService,
              private router: Router,
              private authGuard: AuthGuard) {

  }

  ngOnInit(): void {
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

    this.countrySubscription = this.country
      .distinctUntilChanged()
      .debounceTime(250)
      .subscribe((value) => {
        this.registerForm.get('country').setValue(value);

        if (value === 'Nederland') {
          this.postalcodeService.getPostalcodeData(
            this.registerForm.get('postal_code').value.replace(' ', '')
          ).subscribe((data: any) => {
            try {
              this.registerForm.get('streetname').setValue(data[1]);
            } catch (err) {
            }

            try {
              this.registerForm.get('city').setValue(data[0]);
            } catch (err) {
            }
          });
        }
    });
  }

  ngOnDestroy(): void {
    try {
      this.country.unsubscribe();
      this.countrySubscription.unsubscribe();
    } catch (err) {}
  }

  private postalcode = (): ValidatorFn => {
    return (group: AbstractControl): { [key: string]: any } => {
      const postalcodeValue = group.get('postal_code').value;

      const dutch = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
      const belgian = /^[1-9]{1}[0-9]{3}$/i;

      if (dutch.test(postalcodeValue)) {
        this.country.next('Nederland');
        return undefined;
      } else if (belgian.test(postalcodeValue)) {
        this.country.next('België');
        return undefined;
      }

      group.get('postal_code')
        .setErrors({ 'postalcodeInvalid': true });
      return { 'postalcodeInvalid': true };
    };
  }

  public submitForm(value: Object): void {
    this.disabled = true;
    this.userService.register(value).subscribe(
      (res: any) => {
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
          this.msg = 'Uw account is succesvol aangemaakt!';
        } else {
          this.msg = res.msg;
        }
      });
  }
}
