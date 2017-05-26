/// <reference path="../../interfaces/products/products.interface.ts" />

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Log } from '../../decorators/log.decorator';

import { MetaService } from '../../services/meta.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { AnalyticsService } from '../../services/analytics.service';

import { AutoUnsubscribe } from '../../decorators/auto.unsubscribe.decorator';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.pug',
  styleUrls: ['./cart.component.styl'],
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
export class CartComponent implements OnInit, OnDestroy {
  public products: Array<[string, number, string, number, string]> = [];
  // tslint:disable-next-line:no-inferrable-types
  public price: [number, number, number] = [0, 0, 0];

  private productSubscriptions: Array<Subscription> = [];

  private analyticSubscription: Subscription;


  private static roundToTwo(num: number) {
    return Number(Math.round(Number(`${num}e+2`)) + 'e-2');
  }

  constructor(private metaService: MetaService,
              private cartService: CartService,
              private analyticsService: AnalyticsService,
              private productService: ProductService) {}

  ngOnInit(): void {
    this.metaService.addTags();
    this.cartService.initCart();

    this.getCart();

    this.analyticSubscription = this.analyticsService.visit('Cart').subscribe();
  }

  ngOnDestroy(): void {
    for (const productSubscription in this.productSubscriptions) {
      if (this.productSubscriptions.hasOwnProperty(productSubscription) &&
        (typeof this.productSubscriptions[productSubscription] === 'function')) {
        this.productSubscriptions[productSubscription].unsubscribe();
      }
    }
  }

  private getCart() {
    const products = this.cartService.getCart();

    const allProductsObservables: Array<Observable<productsInterface.RootObject>> = [];

    for (const product in products) {
      if (products.hasOwnProperty(product)) {
        allProductsObservables.push(this.productService.product(products[product][0]));
      }
    }

    Observable.forkJoin(allProductsObservables).subscribe((res: Array<productsInterface.RootObject>) => {
      const deleted: Array<number> = [];

      for (let i = 0; i < res.length; i++) {
        products[i][2] = res[i].name;
        products[i][3] = Number(res[i].price);
        products[i][4] = res[i]._id + '.' + res[i].type;

        if (res[i].name === 'Verwijderd') {
          deleted.push(i);
        }
      }

      deleted.sort((a, b) => b - a);

      for (const index of deleted) {
        products.splice(index, 1);
      }

      this.products = <Array<[string, number, string, number, string]>> products;
      this.getTotalPrice();
    });

  }

  public changeAmount(id: string, event: any): void {
    if (Number(event.target.value) < 1) {
      this.removeProduct(id);
    } else {
      this.cartService.changeAmount(id, Number(event.target.value));

      for (const tProduct in this.products) {
        if (this.products.hasOwnProperty(tProduct)) {
          if (this.products[tProduct][0] === id) {
            this.products[tProduct][1] = event.target.value;

            this.getTotalPrice();
          }
        }
      }
    }
  }

  public removeProduct(id: string): void {
    this.cartService.removeProduct(id);
    this.getCart();
  }

  private getTotalPrice(): void {
    let price = 0;

    for (const tProduct in this.products) {
      if (this.products.hasOwnProperty(tProduct)) {
        price += Number(this.products[tProduct][1]) * Number(this.products[tProduct][3]);
      }
    }

    this.price[0] = price;
    this.price[1] = CartComponent.roundToTwo(price / 121 * 100);
    this.price[2] = CartComponent.roundToTwo(price / 121 * 21);
  }
}



