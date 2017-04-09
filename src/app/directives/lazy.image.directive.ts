import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  AfterViewInit
} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/takeUntil';

@Directive({
    selector: '[appLazyImage]'
})
export class LazyImageDirective implements AfterViewInit {
  @Input() defaultImage: string;
  @Input() loadingImage: string;
  @Input() errorImage: string;
  // tslint:disable-next-line:no-inferrable-types
  @Input() retry: number = 1;
  // tslint:disable-next-line:no-inferrable-types
  @Input() delay: number = 500;


  @Input()
  set url(i_url: string) {
    this.m_url = i_url;
    this.loadImage(i_url);
  }

  set setUrl(i_url) {
    this.m_url = i_url;
    this.loadImage(i_url);
  }

  @Output() loaded: EventEmitter<any> = new EventEmitter<any>();
  @Output() completed: EventEmitter<any> = new EventEmitter<any>();
  @Output() errored: EventEmitter<any> = new EventEmitter<any>();

  private m_url: string;
  private cancel$: Subject<Object> = new Subject();

  constructor(private el: ElementRef) {
  }

  public resetToDefault() {
    this.setImage(this.el.nativeElement, this.defaultImage);
    this.cancel$.next({});
  }

  ngAfterViewInit() {
    this.setImage(this.el.nativeElement, this.defaultImage);
  }

  public setImage(element: HTMLElement, i_url) {
    (<HTMLImageElement>element).src = i_url;
    return element;
  }

  public loadImage(i_url) {
    const pollAPI$ = Observable.defer(() => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = i_url;
        img.onload = () => {
          resolve(i_url);
        };
        img.onerror = err => {
          this.setImage(this.el.nativeElement, this.loadingImage);
          reject(err);
        };
      });
    }).retryWhen(err => {
      return err.scan((errorCount, err2) => {
        if (errorCount >= this.retry) {
          throw err2;
        }
        return errorCount + 1;
      }, 0).delay(this.delay);
    }).takeUntil(this.cancel$);

    pollAPI$.subscribe((v) => {
      this.setImage(this.el.nativeElement, this.m_url);
      this.loaded.emit();
    }, (e) => {
      this.setImage(this.el.nativeElement, this.errorImage);
      this.errored.emit();
    }, () => {
      this.completed.emit();
    });
  }
}
