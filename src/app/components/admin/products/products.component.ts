import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { AdminService } from '../../../services/admin.service';
import { ProductService } from '../../../services/product.service';
import { MetaService } from '../../../services/meta.service';

import { AdminGuard } from '../../../guards/admin.guard';

import { url } from '../../../../constants';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/debounceTime';

import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class AdminProductsComponent implements OnInit {

  // tslint:disable-next-line:no-inferrable-types
  public msg: string = 'Producten';
  public products: Array<Object> = [];

  public categories: Array<Object>;
  // tslint:disable-next-line:no-inferrable-types
  public filterText: string = '';
  // tslint:disable-next-line:no-inferrable-types
  public filterCategoryText: string = '';
  public filterInput = new FormControl();
  public filterCategory = new FormControl();

  constructor(private adminService: AdminService,
              private adminGuard: AdminGuard,
              private productService: ProductService,
              private metaService: MetaService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.metaService.addTags();
    this.adminGuard.checkRemote();

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
      this.adminService.deleteProduct({'id': id}).subscribe(
        (res) => {
          if (res.error === 'false') {
            this.getProducts();

            swal({
              title: 'Verwijderd!',
              type: 'success',
              confirmButtonClass: 'button',
            }).then(() => {
              // pass
            }, (dismiss) => {
              // pass
            });
          }
        }
      );
    }, (dismiss) => {
      // pass
    });
  }
}

