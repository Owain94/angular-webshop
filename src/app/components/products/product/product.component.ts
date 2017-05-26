/// <reference path="../../../interfaces/products/products.interface.ts" />

import { Component, OnInit, AfterContentInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Log } from '../../../decorators/log.decorator';
import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { ProductService } from '../../../services/product.service';
import { MetaService } from '../../../services/meta.service';
import { CartService } from '../../../services/cart.service';
import { NotificationsService } from '../../../services/notifications.service';
import { AnalyticsService } from '../../../services/analytics.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-producs',
  templateUrl: './product.component.pug',
  styleUrls: ['./product.component.styl'],
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
export class ProductComponent implements OnInit, AfterContentInit, OnDestroy {
  public id: string;
  public product: productsInterface.RootObject;

  private activatedRouteParamSubscription: Subscription;
  private productSubscription: Subscription;
  private analyticSubscription: Subscription;
  private analyticProductSubscription: Subscription;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private productService: ProductService,
              private metaService: MetaService,
              private cartService: CartService,
              private analyticsService: AnalyticsService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.activatedRouteParamSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];

      this.productSubscription = this.productService.product(this.id).subscribe(
        (res: productsInterface.RootObject) => {
          if (res.error === 'true') {
            this.router.navigate(['/404']);
          }
          this.product = res;

          this.analyticProductSubscription = this.analyticsService.visit(this.id, false).subscribe();
          this.metaService.addTags(true, res._id, res.name, res.description, res.price);
        }
      );
    });

    this.cartService.initCart();

    this.analyticSubscription = this.analyticsService.visit('Product').subscribe();
  }

  ngAfterContentInit(): void {
    // pass
  }

  ngOnDestroy(): void {
    // pass
  }

  public addToCart() {
    this.cartService.addProduct(this.product._id);

    this.notificationsService.success('Toegevoegd!', `${this.product.name} is toegevoegd aan uw winkelwagen!`);
  }
}
