/// <reference path="../../../../interfaces/generic.interface.ts" />
/// <reference path="../../../../interfaces/user/tfa.token.interface.ts" />
/// <reference path="../../../../interfaces/user/profile.interface.ts" />

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AutoUnsubscribe } from '../../../../decorators/auto.unsubscribe.decorator';

import { UserService } from '../../../../services/user.service';
import { MetaService } from '../../../../services/meta.service';
import { NotificationsService } from '../../../../services/notifications.service';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-profile-tfa',
  templateUrl: './twofactor.component.pug',
  styleUrls: ['./twofactor.component.css']
})

@AutoUnsubscribe()
export class ProfileTfaComponent implements OnInit {
  @ViewChild('tfaToken') tfaToken: ElementRef;

  public twoFactorCode: string;
  public twoFactorKey: string;

  // tslint:disable-next-line:no-inferrable-types
  public twoFactorShow: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public twoFactorInitial: boolean = false;

  private profileDataSubscription: Subscription;
  private tfaTokenSubscription: Subscription;
  private disableTfaSubscription: Subscription;
  private verifyTfaTokenSubscription: Subscription;

  constructor(private userService: UserService,
              private notificationsService: NotificationsService) {

  }

  ngOnInit(): void {
    this.profileDataSubscription = this.userService.profileData()
      .subscribe((res:  profileInterface.RootObject) => {
        this.twoFactorInitial = res.data.tfatoken.length > 0;

        if (this.twoFactorInitial) {
          this.twoFactorShow = true;
        }
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
            this.notificationsService.success('Succesvol!', 'Two Factor authenticatie uitgeschakeld!');
            this.twoFactorInitial = false;
          } else {
            this.notificationsService.error('Onsuccesvol!', 'Een onbekende fout is opgetreden, probeer het later nog eens.');
          }
        }
      );
      return;
    }
    const token: string = this.tfaToken.nativeElement.value;

    if (token.length !== 6) {
      this.notificationsService.error('Onsuccesvol!', 'Foutieve token invoer!');
    } else {
      this.verifyTfaTokenSubscription = this.userService.verifyTfaToken(this.twoFactorKey, token).subscribe(
        (res: boolean) => {
          if (res) {
            this.notificationsService.success('Succesvol!', 'Two Factor authenticatie ingeschakeld!');
            this.twoFactorInitial = true;
          } else {
            this.notificationsService.error('Onsuccesvol!', 'Foutieve token invoer!');
          }
        }
      );
    }
  }
}
