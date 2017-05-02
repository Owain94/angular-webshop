/// <reference path="../../interfaces/products/products.interface.ts" />
/// <reference path="../../interfaces/products/categories.interface.ts" />

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AutoUnsubscribe } from '../../decorators/auto.unsubscribe.decorator';

import { ProductService } from '../../services/product.service';
import { MetaService } from '../../services/meta.service';

import { Subscription } from 'rxjs/Rx';

import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.pug',
  styleUrls: ['./products.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe()
export class ProductsComponent implements OnInit, OnDestroy {

  public products: productsInterface.RootObject;

  public categories: categoriesInterface.RootObject;
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

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private productService: ProductService,
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
        this.changeDetectorRef.markForCheck();
      });

    this.filterCategorySubscription = this.filterCategory
      .valueChanges
      .subscribe(category => {
        this.filterCategoryText = category;
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    // pass
  }

  private getProducts(): void {
    this.productSubscription = this.productService.products(Infinity).subscribe(
      (res: productsInterface.RootObject) => {
        this.products = res;
        this.changeDetectorRef.markForCheck();
      }
    );
  }

  private getCategories(): void {
    this.categoriesSubscription = this.productService.categories().subscribe(
      (res: categoriesInterface.RootObject) => {
        this.categories = res;
        this.changeDetectorRef.markForCheck();
      }
    );
  }

  public reset(): void {
    this.filterInput.setValue('');
    this.filterCategory.setValue('');
    this.filterText = '';
    this.filterCategoryText = '';

    this.changeDetectorRef.markForCheck();
  }

  public trackByFn(index: number, item: productsInterface.RootObject | categoriesInterface.RootObject): string {
    return(item._id);
  }
}
