/// <reference path="../../interfaces/products/products.interface.ts" />
/// <reference path="../../interfaces/products/categories.interface.ts" />

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Log } from '../../decorators/log.decorator';
import { AutoUnsubscribe } from '../../decorators/auto.unsubscribe.decorator';

import { ProductService } from '../../services/product.service';
import { MetaService } from '../../services/meta.service';
import { AnalyticsService } from '../../services/analytics.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.pug',
  styleUrls: ['./products.component.styl'],
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
export class ProductsComponent implements OnInit, OnDestroy {
  public categories: categoriesInterface.RootObject;

  public products: Array<productsInterface.RootObject>;
  public productsFiltered: Array<productsInterface.RootObject>;
  // tslint:disable-next-line:no-inferrable-types
  public filterText: string = '';
  // tslint:disable-next-line:no-inferrable-types
  public filterCategoryText: string = '';
  public filterInput = new FormControl();
  public filterCategory = new FormControl();

  private filterInputSubscription: Subscription;
  private filterCategorySubscription: Subscription;
  private productAndCategorieSubscription: Subscription;
  private analyticSubscription: Subscription;

  constructor(private productService: ProductService,
              private analyticsService: AnalyticsService,
              private metaService: MetaService) {
  }

  ngOnInit(): void {
    this.metaService.addTags();

    this.getProductsAndCategories();

    this.filterInputSubscription = this.filterInput
      .valueChanges
      .debounceTime(250)
      .subscribe(term => {
        this.filterText = term;
        this.filterProducts();
      });

    this.filterCategorySubscription = this.filterCategory
      .valueChanges
      .subscribe(category => {
        this.filterCategoryText = category;
        this.filterProducts();
      });

    this.analyticSubscription = this.analyticsService.visit('Products').subscribe();
  }

  ngOnDestroy(): void {
    // pass
  }

  private getProductsAndCategories(): void {
    this.productAndCategorieSubscription = Observable.forkJoin(
      this.productService.products(Infinity),
      this.productService.categories()
    ).subscribe(
      (res: [Array<productsInterface.RootObject>, categoriesInterface.RootObject]) => {
        this.products = res[0];
        this.categories = res[1];
        this.filterProducts();
      }
    );
  }

  private filterProducts(): void {
    this.productsFiltered = this.products.filter(
      product => product.name.toLowerCase().includes(this.filterText.toLowerCase()) &&
      product.category.includes(this.filterCategoryText)
    );
  }

  public reset(): void {
    this.filterInput.setValue('');
    this.filterCategory.setValue('');
    this.filterText = '';
    this.filterCategoryText = '';
  }

  public trackByFn(index: number, item: productsInterface.RootObject | categoriesInterface.RootObject): string {
    return(item._id);
  }
}
