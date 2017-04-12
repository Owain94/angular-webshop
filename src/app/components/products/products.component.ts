import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { AutoUnsubscribe } from '../../decorators/auto.unsubscribe.decorator';

import { ProductService } from '../../services/product.service';
import { MetaService } from '../../services/meta.service';

import { Subscription } from 'rxjs/Rx';

import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

@AutoUnsubscribe()
export class ProductsComponent implements OnInit {

  public products: Array<Array<Object>> = [];

  public categories: Array<Object>;
  // tslint:disable-next-line:no-inferrable-types
  public filterText: string = '';
  // tslint:disable-next-line:no-inferrable-types
  public filterCategoryText: string = '';
  public filterInput = new FormControl();
  public filterCategory = new FormControl();

  private filterInputSubscription: Subscription;
  private filterCategorySubscription: Subscription;
  private productSubscription: Subscription;
  private categoriesSubscription: Subscription;

  private static spliceArray(arr: Array<Object>): Array<Array<Object>> {
    const outArray = [];

    while (arr.length > 0) {
      outArray.push(arr.splice(0, 3));
    }

    return outArray;
  }

  constructor(private productService: ProductService,
              private metaService: MetaService) {
  }

  ngOnInit(): void {
    this.metaService.addTags();

    this.getProducts();
    this.getCategories();

    this.filterInputSubscription = this.filterInput
      .valueChanges
      .debounceTime(250)
      .subscribe(term => {
        this.filterText = term;
      });

    this.filterCategorySubscription = this.filterCategory
      .valueChanges
      .debounceTime(250)
      .subscribe(category => {
        this.filterCategoryText = category;
      });
  }

  private getProducts(): void {
    this.productSubscription = this.productService.products(Infinity).subscribe(
      (res) => {
        this.products = ProductsComponent.spliceArray(res);
      }
    );
  }

  private getCategories(): void {
    this.categoriesSubscription = this.productService.categories().subscribe(
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

  public trackByFn(index: number, item): string {
    return(item._id);
  }

  public trackByIFn(index: number, item): number {
    return(index);
  }
}
