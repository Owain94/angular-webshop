import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { AdminService } from '../../../services/admin.service';
import { ProductService } from '../../../services/product.service';
import { MetaService } from '../../../services/meta.service';

import { AdminGuard } from '../../../guards/admin.guard';

import { Subscription } from 'rxjs/Rx';

import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

@AutoUnsubscribe()
export class AdminCategoriesComponent implements OnInit {

  // tslint:disable-next-line:no-inferrable-types
  public disabled: boolean = false;
  public addCategoryForm: FormGroup;
  // tslint:disable-next-line:no-inferrable-types
  public msg: string = 'Categorieën';
  public categories: Array<Object>;

  private categoriesSubscription: Subscription;
  private addCategorySubscription: Subscription;
  private updateCategorySubscription: Subscription;
  private deleteCategorySubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private adminService: AdminService,
              private productService: ProductService,
              private metaService: MetaService,
              private adminGuard: AdminGuard) {
  }

  ngOnInit(): void {
    this.metaService.addTags();
    this.adminGuard.checkRemote();

    this.getCategories();

    this.addCategoryForm = this.formBuilder.group({
      'name': [null, Validators.required]
    });
  }

  private getCategories(): void {
    this.categoriesSubscription = this.productService.categories().subscribe(
      (res) => {
        this.categories = res;
      }
    );
  }

  public submitForm(value: Object): void {
    this.disabled = true;
    this.addCategorySubscription = this.adminService.addCategory(value).subscribe(
      (res: any) => {
        this.disabled = false;
        if (res.error === 'false') {
          this.addCategoryForm = this.formBuilder.group({
            'name': [null, Validators.required]
          });
        }

        this.msg = res.msg;

        this.getCategories();
      });
  }

  public edit(category: string, id: string): void {
    swal({
      title: 'Categorie aanpassen',
      input: 'text',
      showCancelButton: true,
      confirmButtonClass: 'button',
      cancelButtonClass: 'button',
      confirmButtonText: 'Opslaan',
      cancelButtonText: 'Annuleer',
      inputValue: category
    }).then((result) => {
      this.updateCategorySubscription = this.adminService.updateCategory({'category': result, 'id': id}).subscribe(
        (res) => {
          if (res.error === 'false') {
            this.getCategories();

            swal({
              title: 'Opgeslagen!',
              type: 'success',
              confirmButtonClass: 'button',
            });
          }
        }
      );
    }, (dismiss) => {
      // pass
    });
  }

  public delete(category: string, id: string): void {
    swal({
      title: `${category} verwijderen?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'button',
      cancelButtonClass: 'button',
      confirmButtonText: 'Verwijderen',
      cancelButtonText: 'Annuleer',
    }).then(() => {
      this.deleteCategorySubscription = this.adminService.deleteCategory({'id': id}).subscribe(
        (res) => {
          if (res.error === 'false') {
            this.getCategories();

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

  public trackByFn(index: number, item): string {
    return(item._id);
  }
}

