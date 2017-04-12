import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { ProductService } from '../../../services/product.service';
import { MetaService } from '../../../services/meta.service';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-producs',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

@AutoUnsubscribe()
export class ProductComponent implements OnInit {

  public id: string;
  public product: Product;

  private activatedRouteParamSubscription: Subscription;
  private productSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private productService: ProductService,
              private metaService: MetaService) {
  }

  ngOnInit(): void {
    this.activatedRouteParamSubscription = this.activatedRoute.params.subscribe(params => {
       this.id = params['id'];

       this.productSubscription = this.productService.product(this.id).subscribe(
        (res: Product) => {
          // console.log(res);
          this.product = res;

          this.metaService.addTags(true, res._id, res.name, res.description, res.price);
        }
      );
    });
  }
}

export interface Product {
  _id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  amount: number;
  photo: string;
}
