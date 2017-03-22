import {
  Component,
  OnInit,
  ElementRef,
  ViewChild
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

import { AuthGuard } from '../../guards/auth.guard';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('emailField') emailField: ElementRef;
    // tslint:disable-next-line:no-inferrable-types
  public disabled: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public tfa: boolean = false;
  public email: string;
  // tslint:disable-next-line:no-inferrable-types
  public msg: string = '';
  public loginForm: FormGroup;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private authGuard: AuthGuard) {

  }

  ngOnInit(): void {
    if (this.authGuard.check()) {
      this.router.navigateByUrl('/');
    }

    this.loginForm = this.formBuilder.group({
      'email': [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      'password': [null, [Validators.required, Validators.minLength(6)]],
      'tfa': [null]
    });

    const eventStream = Observable.fromEvent(this.emailField.nativeElement, 'keyup')
      .map(() => this.emailField.nativeElement.value)
      .debounceTime(1000)
      .distinctUntilChanged();

      eventStream.subscribe(input => {
        const regexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (regexp.test(input)) {
          this.userService.checkTfa(input).subscribe(
            (res: any) => {
              this.tfa = res;
            }
          );
        }
      });
  }

  public submitForm(value: Object): void {
    this.disabled = true;
    this.userService.login(value).subscribe(
      (res: any) => {
        this.disabled = false;
        if (res.error === 'false') {
          localStorage.setItem('user', JSON.stringify({ token: res.data }));
          this.router.navigateByUrl('/');
        } else {
          this.msg = res.msg;
        }
      });
  }
}
