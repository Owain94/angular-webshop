import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { AdminService } from '../../../services/admin.service';
import { ProductService } from '../../../services/product.service';
import { MetaService } from '../../../services/meta.service';

import { AdminGuard } from '../../../guards/admin.guard';

import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {

  // tslint:disable-next-line:no-inferrable-types
  public disabled: boolean = false;
  public addCategoryForm: FormGroup;
  // tslint:disable-next-line:no-inferrable-types
  public msg: string = 'Categorieën';
  public categories: Array<Object>;

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
    this.productService.categories().subscribe(
      (res) => {
        this.categories = res;
      }
    );
  }

  public submitForm(value: Object): void {
    this.disabled = true;
    this.adminService.addCategory(value).subscribe(
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
      this.adminService.updateCategory({'category': result, 'id': id}).subscribe(
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
      this.adminService.deleteCategory({'id': id}).subscribe(
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
}

