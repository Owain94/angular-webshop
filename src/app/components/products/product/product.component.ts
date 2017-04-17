/// <reference path="../../../interfaces/products/products.interface.ts" />

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { ProductService } from '../../../services/product.service';
import { MetaService } from '../../../services/meta.service';
import { CartService } from '../../../services/cart.service';

import { Subscription } from 'rxjs/Rx';

import swal from 'sweetalert2';

@Component({
  selector: 'app-producs',
  templateUrl: './product.component.pug',
  styleUrls: ['./product.component.css']
})

@AutoUnsubscribe()
export class ProductComponent implements OnInit {

  public id: string;
  public product: productsInterface.RootObject;

  private activatedRouteParamSubscription: Subscription;
  private productSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private productService: ProductService,
              private metaService: MetaService,
              private cartService: CartService) {
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

  public addToCart() {
    this.cartService.addProduct(this.product._id);

    swal({
      title: 'Toegevoegd!',
      text: `${this.product.name} is toegevoegd aan uw winkelwagen!`,
      type: 'success',
      confirmButtonClass: 'button',
    }).then(() => {
      // pass
    }, (dismiss) => {
      // pass
    });
  }
}
