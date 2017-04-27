/// <reference path="../../../interfaces/products/products.interface.ts" />

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { ProductService } from '../../../services/product.service';
import { MetaService } from '../../../services/meta.service';
import { CartService } from '../../../services/cart.service';
import { NotificationsService } from '../../../services/notifications.service';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-producs',
  templateUrl: './product.component.pug',
  styleUrls: ['./product.component.css']
})

@AutoUnsubscribe()
export class ProductComponent implements OnInit, OnDestroy {

  public id: string;
  public product: productsInterface.RootObject;

  private activatedRouteParamSubscription: Subscription;
  private productSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private productService: ProductService,
              private metaService: MetaService,
              private cartService: CartService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.activatedRouteParamSubscription = this.activatedRoute.params.subscribe(params => {
       this.id = params['id'];

       this.productSubscription = this.productService.product(this.id).subscribe(
        (res: productsInterface.RootObject) => {
          this.product = res;

          this.metaService.addTags(true, res._id, res.name, res.description, res.price);
        }
      );
    });

    this.cartService.initCart();
  }

  ngOnDestroy(): void {
    // pass
  }

  public addToCart() {
    this.cartService.addProduct(this.product._id);

    this.notificationsService.success('Toegevoegd!', `${this.product.name} is toegevoegd aan uw winkelwagen!`);
  }
}
