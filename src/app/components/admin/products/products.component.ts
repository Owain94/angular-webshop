/// <reference path="../../../interfaces/products/products.interface.ts" />
/// <reference path="../../../interfaces/products/categories.interface.ts" />

import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { AdminService } from '../../../services/admin.service';
import { ProductService } from '../../../services/product.service';
import { MetaService } from '../../../services/meta.service';
import { NotificationsService } from '../../../services/notifications.service';

import { AdminGuard } from '../../../guards/admin.guard';

import { url } from '../../../../constants';

import { Subscription } from 'rxjs/Rx';

import 'rxjs/add/operator/debounceTime';

import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-products',
  templateUrl: './products.component.pug',
  styleUrls: ['./products.component.css']
})

@AutoUnsubscribe()
export class AdminProductsComponent implements OnInit, AfterContentInit {
  public products: productsInterface.RootObject;

  public categories: categoriesInterface.RootObject;
  // tslint:disable-next-line:no-inferrable-types
  public filterText: string = '';
  // tslint:disable-next-line:no-inferrable-types
  public filterCategoryText: string = '';
  public filterInput = new FormControl();
  public filterCategory = new FormControl();

  private activatedRouteParamSubscription: Subscription;
  private filterInputSubscription: Subscription;
  private filterCategorySubscription: Subscription;
  private productsSubscription: Subscription;
  private categoriesSubscription: Subscription;
  private deleteProductSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private adminService: AdminService,
              private adminGuard: AdminGuard,
              private productService: ProductService,
              private metaService: MetaService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.metaService.addTags();
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
      .debounceTime(250)
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

  private getProducts(): void {
    this.productsSubscription = this.productService.products(Infinity).subscribe(
      (res: productsInterface.RootObject) => {
        this.products = res;
      }
    );
  }

  private getCategories(): void {
    this.categoriesSubscription = this.productService.categories().subscribe(
      (res: categoriesInterface.RootObject) => {
        this.categories = res;
      }
    );
  }

  public preview(photo: string) {
    swal({
      confirmButtonClass: 'button',
      confirmButtonText: 'Ok',
      imageUrl: `${url}/assets/products/${photo}`
    }).then(() => {
      // pass
    }, (dismiss) => {
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
    }, (dismiss) => {
      // pass
    });
  }

  public trackByFn(index: number, item: productsInterface.RootObject | categoriesInterface.RootObject): string {
    return(item._id);
  }
}

