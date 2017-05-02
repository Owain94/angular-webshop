import { Component, EventEmitter, OnInit, OnDestroy, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { Options } from '../../../interfaces/notifications/options.type';
import { Notification } from '../../../interfaces/notifications/notification.type';

import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { NotificationsService } from '../../../services/notifications.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.pug',
  styleUrls: ['./notifications.component.styl'],
  changeDetection: ChangeDetectionStrategy.Default
})
@AutoUnsubscribe()
export class NotificationsComponent implements OnInit, OnDestroy {

  @Input() set options(opt: Options) {
    this.attachChanges(opt);
  }

  @Output() onCreate = new EventEmitter();
  @Output() onDestroy = new EventEmitter();

  public notifications: Notification[] = [];
  public position: ['top' | 'bottom', 'right' | 'left'] = ['bottom', 'right'];

  private lastNotificationCreated: Notification;
  private listener: Subscription;

  private lastOnBottom = true;
  private maxStack = 8;
  private preventLastDuplicates: any = false;
  private preventDuplicates = false;

  public timeOut = 4500;
  public maxLength = 0;
  public clickToClose = true;
  public showProgressBar = true;
  public pauseOnHover = true;
  public theClass = '';
  public rtl = false;
  public animate: 'fromRight' | 'fromLeft' | 'rotate' | 'scale' = 'fromRight';

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.listener = this.notificationsService.getChangeEmitter()
      .subscribe(item => {
        switch (item.command) {
          case 'cleanAll':
            this.notifications = [];
            break;

          case 'clean':
            this.cleanSingle(item.id!);
            break;

          case 'set':
            if (item.add) {
              this.add(item.notification!);
            } else {
              this.defaultBehavior(item);
            }
            break;

          default:
            this.defaultBehavior(item);
            break;
          }
        });
  }

  defaultBehavior(value: any): void {
    this.notifications.splice(this.notifications.indexOf(value.notification), 1);
    this.onDestroy.emit(this.buildEmit(value.notification, false));
  }

  add(item: Notification): void {
    item.createdOn = new Date();

    const toBlock: boolean = this.preventLastDuplicates || this.preventDuplicates ? this.block(item) : false;

    this.lastNotificationCreated = item;

    if (!toBlock) {
      if (this.lastOnBottom) {
        if (this.notifications.length >= this.maxStack) {
          this.notifications.splice(0, 1);
        }
        this.notifications.push(item);
      } else {
        if (this.notifications.length >= this.maxStack) {
          this.notifications.splice(this.notifications.length - 1, 1);
        }
        this.notifications.splice(0, 0, item);
      }

      this.onCreate.emit(this.buildEmit(item, true));
    }
  }

  block(item: Notification): boolean {
    const toCheck = item.html ? this.checkHtml : this.checkStandard;

    if (this.preventDuplicates && this.notifications.length > 0) {
      for (let i = 0; i < this.notifications.length; i++) {
        if (toCheck(this.notifications[i], item)) {
          return true;
        }
      }
    }

    if (this.preventLastDuplicates) {
      let comp: Notification;
      if (this.preventLastDuplicates === 'visible' && this.notifications.length > 0) {
        if (this.lastOnBottom) {
          comp = this.notifications[this.notifications.length - 1];
        } else {
          comp = this.notifications[0];
        }
      } else if (this.preventLastDuplicates === 'all' && this.lastNotificationCreated) {
        comp = this.lastNotificationCreated;
      } else {
        return false;
      }
      return toCheck(comp, item);
    }

    return false;
  }

  checkStandard(checker: Notification, item: Notification): boolean {
    return checker.type === item.type && checker.title === item.title && checker.content === item.content;
  }

  checkHtml(checker: Notification, item: Notification): boolean {
    // tslint:disable-next-line:max-line-length
    return checker.html ? checker.type === item.type && checker.title === item.title && checker.content === item.content && checker.html === item.html : false;
  }

  attachChanges(options: any): void {
    Object.keys(options).forEach(a => {
      if (this.hasOwnProperty(a)) {
        (<any>this)[a] = options[a];
      }
    });
  }

  buildEmit(notification: Notification, to: boolean) {
    const toEmit: Notification = {
      createdOn: notification.createdOn,
      type: notification.type,
      icon: notification.icon,
      id: notification.id
    };

    if (notification.html) {
      toEmit.html = notification.html;
    } else {
      toEmit.title = notification.title;
      toEmit.content = notification.content;
    }

    if (!to) {
      toEmit.destroyedOn = new Date();
    }

    return toEmit;
  }

  cleanSingle(id: string): void {
    let indexOfDelete = 0;
    let doDelete = false;

    this.notifications.forEach((notification, idx) => {
      if (notification.id === id) {
        indexOfDelete = idx;
        doDelete = true;
      }
    });

    if (doDelete) {
      this.notifications.splice(indexOfDelete, 1);
    }
  }

  ngOnDestroy(): void {
    // pass
  }
}
