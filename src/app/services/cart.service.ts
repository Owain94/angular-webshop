import { LocalStorageService } from './localstorage.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CartService {
  private products: Array<[string, number]> = [];

  constructor(private localStorageService: LocalStorageService) {}

  public initCart() {
    const cart = this.localStorageService.get('cart');

    if (cart !== null) {
      this.products = <Array<[string, number]>> cart;
    }
  }

  public getCart(): Array<[string, number]> {
    return this.products;
  }

  public addProduct(id: string): void {
    this.initCart();

    for (const tProduct in this.products) {
      if (this.products.hasOwnProperty(tProduct)) {
        if (this.products[tProduct][0] === id) {
          this.products[tProduct][1] += 1;
          this.saveCart();
          return;
        }
      }
    }
    this.products.push([id, 1]);
    this.saveCart();
  }

  public changeAmount(id: string, amount: number): void {
    this.initCart();
    for (const tProduct in this.products) {
      if (this.products.hasOwnProperty(tProduct)) {
        if (this.products[tProduct][0] === id) {
          this.products[tProduct][1] = amount;
          this.saveCart();
          return;
        }
      }
    }
  }

  public removeProduct(id: string): void {
    this.products = this.products.filter((i) => {
      return i[0] !== id;
    });
    this.saveCart();
  }

  private saveCart() {
    this.localStorageService.set('cart', this.products);
  }
}
