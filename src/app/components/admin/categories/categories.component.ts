/// <reference path="../../../interfaces/generic.interface.ts" />
/// <reference path="../../../interfaces/products/categories.interface.ts" />

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { Log } from '../../../decorators/log.decorator';
import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';

import { AdminService } from '../../../services/admin.service';
import { ProductService } from '../../../services/product.service';
import { NotificationsService } from '../../../services/notifications.service';
import { AnalyticsService } from '../../../services/analytics.service';

import { AdminGuard } from '../../../guards/admin.guard';

import { Subscription } from 'rxjs/Subscription';

import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './categories.component.pug',
  styleUrls: ['./categories.component.styl'],
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
export class AdminCategoriesComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-inferrable-types
  public disabled: boolean = false;
  public addCategoryForm: FormGroup;
  public categories: categoriesInterface.RootObject;

  private categoriesSubscription: Subscription;
  private addCategorySubscription: Subscription;
  private updateCategorySubscription: Subscription;
  private deleteCategorySubscription: Subscription;
  private analyticSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private adminService: AdminService,
              private productService: ProductService,
              private adminGuard: AdminGuard,
              private analyticsService: AnalyticsService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.adminGuard.checkRemote();

    this.getCategories();

    this.addCategoryForm = this.formBuilder.group({
      'name': [null, Validators.required]
    });

    this.analyticSubscription = this.analyticsService.visit('AdminCategories').subscribe();
  }

  ngOnDestroy(): void {
    // pass
  }

  private getCategories(): void {
    this.categoriesSubscription = this.productService.categories(true).subscribe(
      (res: categoriesInterface.RootObject) => {
        this.categories = res;
      }
    );
  }

  public submitForm(value: Object): void {
    this.disabled = true;
    this.addCategorySubscription = this.adminService.addCategory(value).subscribe(
      (res: genericInterface.RootObject) => {
        this.disabled = false;
        if (res.error === 'false') {
          this.addCategoryForm = this.formBuilder.group({
            'name': [null, Validators.required]
          });
        }

        if (res.error === 'false') {
          this.notificationsService.success('Succesvol!', 'Categorie toegevoegd!');
        } else {
          this.notificationsService.error('Onsuccesvol!', 'Er is een onbekende fout opgetreden, probeer het later noog eens.');
        }

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
    }).then((result: string) => {
      this.updateCategorySubscription = this.adminService.updateCategory({'category': result, 'id': id}).subscribe(
        (res: genericInterface.RootObject) => {
          if (res.error === 'false') {
            this.getCategories();
            this.notificationsService.success('Succesvol!', 'Categorie aangepast!');
          } else {
            this.notificationsService.error('Onsuccesvol!', 'Er is een onbekende fout opgetreden, probeer het later noog eens.');
          }
        }
      );
    }, (dismiss: any) => {
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
        (res: genericInterface.RootObject) => {
          if (res.error === 'false') {
            this.getCategories();
            this.notificationsService.success('Succesvol!', 'Categorie verwijderd!');
          } else {
            this.notificationsService.error('Onsuccesvol!', 'Er is een onbekende fout opgetreden, probeer het later noog eens.');
          }
        }
      );
    }, (dismiss: any) => {
      // pass
    });
  }

  public trackByFn(index: number, item: categoriesInterface.RootObject): string {
    return(item._id);
  }
}

