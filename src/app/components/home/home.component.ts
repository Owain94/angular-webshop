/// <reference path="../../interfaces/products/products.interface.ts" />

import { Component, OnInit } from '@angular/core';

import { AutoUnsubscribe } from '../../decorators/auto.unsubscribe.decorator';

import { ProductService } from '../../services/product.service';
import { MetaService } from '../../services/meta.service';

import { AuthGuard } from '../../guards/auth.guard';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.pug',
  styleUrls: ['./home.component.css']
})

@AutoUnsubscribe()
export class HomeComponent implements OnInit {
  public button: [string, string];
  public products: productsInterface.RootObject;

  private productSubscription: Subscription;

  constructor(private authGuard: AuthGuard,
              private productService: ProductService,
              private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.addTags();

    if (!this.authGuard.check()) {
      this.button = ['/login', 'Aanmelden'];
    }

    this.productSubscription = this.productService.products(6).subscribe(
      (res: productsInterface.RootObject) => {
        this.products = res;
      }
    );
  }

  public trackByFn(index: number, item: productsInterface.RootObject): string {
    return(item._id);
  }
}
