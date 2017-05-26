/// <reference path="../../../interfaces/products/products.interface.ts" />
/// <reference path="../../../interfaces/products/categories.interface.ts" />

import { Component, OnInit, AfterContentInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import { Log } from '../../../decorators/log.decorator';
import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { AdminService } from '../../../services/admin.service';
import { ProductService } from '../../../services/product.service';
import { NotificationsService } from '../../../services/notifications.service';
import { AnalyticsService } from '../../../services/analytics.service';

import { AdminGuard } from '../../../guards/admin.guard';

import { url } from '../../../../helpers/constants';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/debounceTime';

import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-products',
  templateUrl: './products.component.pug',
  styleUrls: ['./products.component.styl'],
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
export class AdminProductsComponent implements OnInit, AfterContentInit, OnDestroy {
  public categories: categoriesInterface.RootObject;

  public products: Array<productsInterface.RootObject>;
  public productsFiltered: Array<productsInterface.RootObject>;
  // tslint:disable-next-line:no-inferrable-types
  public filterText: string = '';
  // tslint:disable-next-line:no-inferrable-types
  public filterCategoryText: string = '';
  public filterInput = new FormControl();
  public filterCategory = new FormControl();

  private activatedRouteParamSubscription: Subscription;
  private filterInputSubscription: Subscription;
  private filterCategorySubscription: Subscription;
  private productAndCategorieSubscription: Subscription;
  private deleteProductSubscription: Subscription;
  private analyticSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private adminService: AdminService,
              private adminGuard: AdminGuard,
              private productService: ProductService,
              private analyticsService: AnalyticsService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.adminGuard.checkRemote();

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

    this.analyticSubscription = this.analyticsService.visit('AdminProducts').subscribe();
  }

  ngAfterContentInit(): void {
    this.activatedRouteParamSubscription = this.activatedRoute.params.subscribe(params => {
      setTimeout(() => {
        if (params['type'] === 'added') {
          this.notificationsService.success('Succesvol!', 'Product is toegevoegd!');
        } else if (params['type'] === 'edited') {
          this.notificationsService.success('Succesvol!', 'Product is aangepast!');
        }
      }, 100);
    });
  }

  ngOnDestroy(): void {
    // pass
  }


  private getProductsAndCategories(): void {
    this.productAndCategorieSubscription = Observable.forkJoin(
      this.productService.products(Infinity, true),
      this.productService.categories(true)
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

  public preview(photo: string) {
    swal({
      confirmButtonClass: 'button',
      confirmButtonText: 'Ok',
      imageUrl: `${url}/assets/products/${photo}`
    }).then(() => {
      // pass
    }, (dismiss: any) => {
      // pass
    });
  }

  public reset() {
    this.filterInput.setValue('');
    this.filterCategory.setValue('');
    this.filterText = '';
    this.filterCategoryText = '';
  }

  public delete(id: string, name: string): void {
    swal({
      title: `${name} verwijderen?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'button',
      cancelButtonClass: 'button',
      confirmButtonText: 'Verwijderen',
      cancelButtonText: 'Annuleer',
    }).then(() => {
      this.deleteProductSubscription = this.adminService.deleteProduct(id).subscribe(
        (res: genericInterface.RootObject) => {
          if (res.error === 'false') {
            this.getProductsAndCategories();
            this.notificationsService.success('Succesvol!', 'Product verwijderd!');
          } else {
            this.notificationsService.error('Onsuccesvol!', 'Er is een onbekende fout opgetreden, probeer het later noog eens.');
          }
        }
      );
    }, (dismiss: any) => {
      // pass
    });
  }

  public trackByFn(index: number, item: productsInterface.RootObject | categoriesInterface.RootObject): string {
    return(item._id);
  }
}

