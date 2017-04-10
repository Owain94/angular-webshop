import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { ProductService } from '../../services/product.service';
import { MetaService } from '../../services/meta.service';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public products: Array<Object> = [];

  public categories: Array<Object>;
  // tslint:disable-next-line:no-inferrable-types
  public filterText: string = '';
  // tslint:disable-next-line:no-inferrable-types
  public filterCategoryText: string = '';
  public filterInput = new FormControl();
  public filterCategory = new FormControl();

  constructor(private productService: ProductService,
              private metaService: MetaService) {
  }

  ngOnInit(): void {
    this.metaService.addTags();

    this.getProducts();
    this.getCategories();

    this.filterInput
      .valueChanges
      .debounceTime(250)
      .subscribe(term => {
        this.filterText = term;
      });

    this.filterCategory
      .valueChanges
      .debounceTime(250)
      .subscribe(category => {
        this.filterCategoryText = category;
      });
  }

  private getProducts(): void {
    this.productService.products(Infinity).subscribe(
      (res) => {
        this.products = res;
      }
    );
  }

  private getCategories(): void {
    this.productService.categories().subscribe(
      (res) => {
        this.categories = res;
      }
    );
  }

  public reset() {
    this.filterInput.setValue('');
    this.filterCategory.setValue('');
    this.filterText = '';
    this.filterCategoryText = '';
  }
}
