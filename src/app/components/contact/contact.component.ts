import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Log } from '../../decorators/log.decorator';

import { MetaService } from '../../services/meta.service';
import { AnalyticsService } from '../../services/analytics.service';
import { NotificationsService } from '../../services/notifications.service';
import { UserService } from '../../services/user.service';

import { AuthGuard } from '../../guards/auth.guard';

import { AutoUnsubscribe } from '../../decorators/auto.unsubscribe.decorator';

import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.pug',
  styleUrls: ['./contact.component.styl'],
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
export class ContactComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line:no-inferrable-types
  public disabled: boolean = false;
  public contactForm: FormGroup;
  public contactData: profileInterface.RootObject;

  private profileDataSubscription: Subscription;
  private registerSubscription: Subscription;

  private analyticSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private authGuard: AuthGuard,
              private metaService: MetaService,
              private analyticsService: AnalyticsService,
              private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.metaService.addTags();
    this.initForm();

    this.analyticSubscription = this.analyticsService.visit('Contact').subscribe();
  }

  ngOnDestroy(): void {
    // pass
  }

  private initForm(): void {
    this.contactForm = this.formBuilder.group({
      'firstname' : [null, Validators.required],
      'surname_prefix' : [null],
      'surname': [null, Validators.required],
      'email': [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      'subject': [null, Validators.required],
      'message': [null, Validators.required]
    });
    this.getContactData();
  }

  private getContactData(): void {
    if (this.authGuard.check()) {
      if (!this.contactData) {
        this.profileDataSubscription = this.userService.profileData()
          .subscribe((res:  profileInterface.RootObject) => {
            this.contactData = res;
            this.formData();
        });
      } else {
        this.formData();
      }
    }
  }

  private formData(): void {
    const firstnameField = this.contactForm.get('firstname');
    const surnamePrefixField = this.contactForm.get('surname_prefix');
    const surnameField = this.contactForm.get('surname');
    const emailField = this.contactForm.get('email');

    if (firstnameField) {
      firstnameField.setValue(this.contactData.data.firstname);
      firstnameField.disable();
    }
    if (surnamePrefixField) {
      surnamePrefixField.setValue(this.contactData.data.surname_prefix);
      surnamePrefixField.disable();
    }
    if (surnameField) {
      surnameField.setValue(this.contactData.data.surname);
      surnameField.disable();
    }
    if (emailField) {
      emailField.setValue(this.contactData.data.email);
      emailField.disable();
    }
  }

  public submitForm(value: Object): void {
    this.notificationsService.info('Versturen...', 'Even geduld alstublieft!');
    this.disabled = true;

    if (this.authGuard.check()) {
      value['firstname'] = this.contactData.data.firstname;
      value['surname_prefix'] = this.contactData.data.surname_prefix;
      value['surname'] = this.contactData.data.surname;
      value['email'] = this.contactData.data.email;
    }

    this.registerSubscription = this.userService.contact(value).subscribe(
      (res: any) => {
          this.disabled = false;

        if (res.error === 'false') {
          this.initForm();
          this.notificationsService.success('Succesvol!', 'Uw bericht is verzonden!');
        } else {
          this.notificationsService.error('Onsuccesvol!', res.msg);
        }
      });
  }

  public resetForm(): void {
    if (this.authGuard.check()) {
      const subjectField = this.contactForm.get('subject');
      const messageField = this.contactForm.get('message');

      if (subjectField) {
        subjectField.setValue(null);
      }
      if (messageField) {
        messageField.setValue(null);
      }
    } else {
      this.contactForm.reset();
    }
  }
}



