import {Injectable} from '@angular/core';

import { AutoUnsubscribe } from '../decorators/auto.unsubscribe.decorator';

import { INotifyOptions } from './../interfaces/localstorage/notify-options.interface';
import { ILocalStorageEvent } from './../interfaces/localstorage/local-storage-events.interface';

import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';

import 'rxjs/add/operator/share';

// tslint:disable-next-line:no-inferrable-types
const LOCAL_STORAGE_NOT_SUPPORTED: string = 'LOCAL_STORAGE_NOT_SUPPORTED';

@AutoUnsubscribe()
@Injectable()
export class LocalStorageService {
  // tslint:disable-next-line:no-inferrable-types
  public isSupported: boolean = false;

  public errors$: Observable<string>;
  public removeItems$: Observable<ILocalStorageEvent>;
  public setItems$: Observable<ILocalStorageEvent>;
  public warnings$: Observable<string>;

  private notifyOptions: INotifyOptions = {
    setItem: false,
    removeItem: false
  };
  // tslint:disable-next-line:no-inferrable-types
  private prefix: string = 'inkies-';
  private storageType: 'sessionStorage' | 'localStorage' = 'localStorage';
  private webStorage: Storage;

  private errors: Subscriber<string> = new Subscriber<string>();
  private removeItems: Subscriber<ILocalStorageEvent> = new Subscriber<ILocalStorageEvent>();
  private setItems: Subscriber<ILocalStorageEvent> = new Subscriber<ILocalStorageEvent>();
  private warnings: Subscriber<string> = new Subscriber<string>();

  constructor() {
    this.errors$ = new Observable<string>((observer: Subscriber<string>) => this.errors = observer).share();
    this.removeItems$ = new Observable<ILocalStorageEvent>((observer: Subscriber<ILocalStorageEvent>) =>
                                                            this.removeItems = observer).share();
    this.setItems$ = new Observable<ILocalStorageEvent>((observer: Subscriber<ILocalStorageEvent>) => this.setItems = observer).share();
    this.warnings$ = new Observable<string>((observer: Subscriber<string>) => this.warnings = observer).share();

    this.isSupported = this.checkSupport();
  }

  public deriveKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  //noinspection FunctionNamingConventionJS
  public get <T>(key: string): T {
    if (!this.isSupported) {
      this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
      return null;
    }

    const item = this.webStorage ? this.webStorage.getItem(this.deriveKey(key)) : null;
    if (!item || item === 'null') {
      return null;
    }

    try {
      return JSON.parse(item);
    } catch (e) {
      return null;
    }
  }

  public getPromise(key: string) {
    return new Promise((resolve) => {{
      resolve(this.get(key));
    }});
  }

  public keys(): Array<string> {
    if (!this.isSupported) {
      this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
      return [];
    }

    const prefixLength = this.prefix.length;
    const keys: Array<string> = [];
    for (const key in this.webStorage) {
      // Only return keys that are for this app
      if (key.substr(0, prefixLength) === this.prefix) {
        try {
          keys.push(key.substr(prefixLength));
        } catch (e) {
          this.errors.next(e.message);
          return [];
        }
      }
    }
    return keys;
  }

  public remove(...keys: Array<string>): boolean {
    let result = true;
    keys.forEach((key: string) => {
      if (!this.isSupported) {
        this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
        result = false;
      }

      try {
        this.webStorage.removeItem(this.deriveKey(key));
        if (this.notifyOptions.removeItem) {
          this.removeItems.next({
            key: key,
            storageType: this.storageType
          });
        }
      } catch (e) {
        this.errors.next(e.message);
        result = false;
      }
    });
    return result;
  }

  //noinspection FunctionNamingConventionJS
  public set(key: string, value: any): boolean {
    if (value === undefined) {
      value = null;
    } else {
      value = JSON.stringify(value);
    }

    if (!this.isSupported) {
      this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
      return false;
    }

    try {
      if (this.webStorage) {
        this.webStorage.setItem(this.deriveKey(key), value);
      }
      if (this.notifyOptions.setItem) {
        this.setItems.next({
          key: key,
          newValue: value,
          storageType: this.storageType
        });
      }
    } catch (e) {
      this.errors.next(e.message);
      return false;
    }
    return true;
  }

  public setPromise(key: string, value: any) {
    return new Promise((resolve) => {{
      this.set(key, value);
      resolve();
    }});
  }

  private checkSupport(): boolean {
    try {
      const supported = this.storageType in window
        && window[this.storageType] !== null;

      if (supported) {
        this.webStorage = window[this.storageType];

        const key = this.deriveKey(`__${Math.round(Math.random() * 1.0e7)}`);
        this.webStorage.setItem(key, '');
        this.webStorage.removeItem(key);
      }

      return supported;
    } catch (e) {
      this.errors.next(e.message);
      return false;
    }
  }
}
