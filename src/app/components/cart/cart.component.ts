/// <reference path="../../interfaces/products/products.interface.ts" />

import { Component, OnInit } from '@angular/core';

import { MetaService } from '../../services/meta.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.pug',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public products: Array<[string, number, string, number, string]> = [];
  // tslint:disable-next-line:no-inferrable-types
  public price: [number, number, number] = [0, 0, 0];

  constructor(private metaService: MetaService,
              private  cartService: CartService,
              private  productService: ProductService) {}

  ngOnInit(): void {
    this.metaService.addTags();
    this.cartService.initCart();

    this.getCart();
  }

  private getCart() {
    const products = this.cartService.getCart();
    for (const product in products) {
      if (products.hasOwnProperty(product)) {
        this.productService.product(products[product][0]).subscribe((res: productsInterface.RootObject) => {
          products[product][2] = res.name;
          products[product][3] = Number(res.price);
          products[product][4] = res.photo;

          this.getTotalPrice();
        });
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
            return;
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
    this.price[1] = this.roundToTwo(price / 121 * 100);
    this.price[2] = this.roundToTwo(price / 121 * 21);
  }

  private roundToTwo(num: number) {
    return Number(Math.round(Number(`${num}e+2`)) + 'e-2');
  }
}



