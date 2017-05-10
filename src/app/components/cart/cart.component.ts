/// <reference path="../../interfaces/products/products.interface.ts" />

import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { Log } from '../../decorators/log.decorator';
import { PageAnalytics } from '../../decorators/page.analytic.decorator';

import { MetaService } from '../../services/meta.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.pug',
  styleUrls: ['./cart.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Log()
@PageAnalytics('Cart')
export class CartComponent implements OnInit, OnDestroy {
  public products: Array<[string, number, string, number, string]> = [];
  // tslint:disable-next-line:no-inferrable-types
  public price: [number, number, number] = [0, 0, 0];

  private productSubscriptions: Array<Subscription> = [];


  private static roundToTwo(num: number) {
    return Number(Math.round(Number(`${num}e+2`)) + 'e-2');
  }

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private metaService: MetaService,
              private cartService: CartService,
              private productService: ProductService) {}

  ngOnInit(): void {
    this.metaService.addTags();
    this.cartService.initCart();

    this.getCart();
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
    for (const product in products) {
      if (products.hasOwnProperty(product)) {
        this.productSubscriptions.push(this.productService.product(products[product][0]).subscribe((res: productsInterface.RootObject) => {
          products[product][2] = res.name;
          products[product][3] = Number(res.price);
          products[product][4] = res.photo;

          this.getTotalPrice();
        }));
      }
    }

    this.products = <Array<[string, number, string, number, string]>> products;
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

    this.changeDetectorRef.markForCheck();
  }
}



