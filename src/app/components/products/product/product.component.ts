import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../../../services/product.service';
import { MetaService } from '../../../services/meta.service';

@Component({
  selector: 'app-producs',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public id: string;
  public product: Object;

  constructor(private activatedRoute: ActivatedRoute,
              private productService: ProductService,
              private metaService: MetaService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
       this.id = params['id'];

       this.productService.product(this.id).subscribe(
        (res) => {
          // console.log(res);
          this.product = res;

          this.metaService.addTags(res._id, res.name, res.description, res.price);
        }
      );
    });
  }
}
