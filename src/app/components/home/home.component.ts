import { Observable } from 'rxjs/Observable';
/// <reference path="../../interfaces/products/products.interface.ts" />

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Log } from '../../decorators/log.decorator';
import { LogObservable } from '../../decorators/log.observable.decorator';
import { AutoUnsubscribe } from '../../decorators/auto.unsubscribe.decorator';

import { ProductService } from '../../services/product.service';
import { MetaService } from '../../services/meta.service';
import { AnalyticsService } from '../../services/analytics.service';

import { AuthGuard } from '../../guards/auth.guard';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.pug',
  styleUrls: ['./home.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Log()
@AutoUnsubscribe()
export class HomeComponent implements OnInit, OnDestroy {
  public button: [string, string];
  @LogObservable public products: Observable<Array<productsInterface.RootObject>>;

  private analyticSubscription: Subscription;

  constructor(private authGuard: AuthGuard,
              private productService: ProductService,
              private metaService: MetaService,
              private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.metaService.addTags();

    if (!this.authGuard.check()) {
      this.button = ['/login', 'Aanmelden'];
    }

    this.products = this.productService.products(6);

    this.analyticSubscription = this.analyticsService.visit('Home').subscribe();
  }

  ngOnDestroy(): void {
    // pass
  }

  public trackByFn(index: number, item: productsInterface.RootObject): string {
    return(item._id);
  }
}
