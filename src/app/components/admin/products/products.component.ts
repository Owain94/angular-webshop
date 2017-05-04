/// <reference path="../../../interfaces/products/products.interface.ts" />
/// <reference path="../../../interfaces/products/categories.interface.ts" />

import { Component, OnInit, AfterContentInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import { Log } from '../../../decorators/log.decorator';
import { LogObservable } from '../../../decorators/log.observable.decorator';
import { PageAnalytics } from '../../../decorators/page.analytic.decorator';
import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { AdminService } from '../../../services/admin.service';
import { ProductService } from '../../../services/product.service';
import { NotificationsService } from '../../../services/notifications.service';

import { AdminGuard } from '../../../guards/admin.guard';

import { url } from '../../../../helpers/constants';

import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

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
@PageAnalytics('AdminProducts')
export class AdminProductsComponent implements OnInit, AfterContentInit, OnDestroy {
  @LogObservable public products: Observable<productsInterface.RootObject>;

  @LogObservable public categories: Observable<categoriesInterface.RootObject>;
  // tslint:disable-next-line:no-inferrable-types
  public filterText: string = '';
  // tslint:disable-next-line:no-inferrable-types
  public filterCategoryText: string = '';
  public filterInput = new FormControl();
  public filterCategory = new FormControl();

  private activatedRouteParamSubscription: Subscription;
  private filterInputSubscription: Subscription;
  private filterCategorySubscription: Subscription;
  private deleteProductSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private adminService: AdminService,
              private adminGuard: AdminGuard,
              private productService: ProductService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.adminGuard.checkRemote();

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
      .subscribe(category => {
        this.filterCategoryText = category;
      });
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

  private getProducts(): void {
    this.products = this.productService.products(Infinity, true);
  }

  private getCategories(): void {
    this.categories = this.productService.categories(true);
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
      this.deleteProductSubscription = this.adminService.deleteProduct({'id': id}).subscribe(
        (res: genericInterface.RootObject) => {
          if (res.error === 'false') {
            this.getProducts();
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

