/// <reference path="../../../../interfaces/generic.interface.ts" />
/// <reference path="../../../../interfaces/products/categories.interface.ts" />

import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

import { Log } from '../../../../decorators/log.decorator';
import { AutoUnsubscribe } from '../../../../decorators/auto.unsubscribe.decorator';

import { AdminService } from '../../../../services/admin.service';
import { ProductService } from '../../../../services/product.service';
import { NotificationsService } from '../../../../services/notifications.service';

import { AdminGuard } from '../../../../guards/admin.guard';

import { Subscription } from 'rxjs/Subscription';

import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-add-product',
  templateUrl: './add.product.component.pug',
  styleUrls: ['./add.product.component.styl'],
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
export class AdminAddProductComponent implements OnInit, OnDestroy {
  @ViewChild('cropper') cropper: ImageCropperComponent;

  public data: any;
  public cropperSettings: CropperSettings;
  public croppedWidth: number;
  public croppedHeight: number;
  // tslint:disable-next-line:no-inferrable-types
  public showDialog: boolean = false;
  public addProductForm: FormGroup;
  // tslint:disable-next-line:no-inferrable-types
  public disabled: boolean = false;
  public categories: categoriesInterface.RootObject;


  private categoriesSubscription: Subscription;
  private addProductSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private adminService: AdminService,
              private adminGuard: AdminGuard,
              private router: Router,
              private notificationsService: NotificationsService) {
    this.cropperSettings = new CropperSettings();

    this.cropperSettings.noFileInput = true;
    this.cropperSettings.preserveSize = true;

    this.cropperSettings.width = 500;
    this.cropperSettings.height = 500;

    this.cropperSettings.croppedWidth = 1000;
    this.cropperSettings.croppedHeight = 1000;

    this.cropperSettings.canvasWidth = 500;
    this.cropperSettings.canvasHeight = 500;

    this.cropperSettings.minWidth = 10;
    this.cropperSettings.minHeight = 10;

    this.cropperSettings.rounded = false;
    this.cropperSettings.keepAspect = true;

    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;

    this.data = {};
  }

  ngOnInit(): void {
    this.adminGuard.checkRemote();

    this.categoriesSubscription = this.productService.categories(true).subscribe(
      (res: categoriesInterface.RootObject) => {
        this.categories = res;
      }
    );

    this.addProductForm = this.formBuilder.group({
      'name': [null, [Validators.required, Validators.maxLength(30)]],
      'category': [null, Validators.required],
      'amount': [-1, Validators.required],
      'price': [null,
        [
          Validators.required,
          Validators.pattern(/(?:^\d{1,3}(?:\.?\d{3})*(?:,\d{2})?$)|(?:^\d{1,3}(?:,?\d{3})*(?:\.\d{2})?$)/)
        ]
      ],
      'description': [null, Validators.required],
      'photo': [null, Validators.required]
    });
  }

  ngOnDestroy(): void {
    // pass
  }

  public cropped(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;

    const photoField = this.addProductForm.get('photo');

    if (photoField) {
      photoField.setValue(this.data.image) ;
    }
  }

  public fileChangeListener($event: any) {
    const image: any = new Image();
    const file: File = $event.target.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (loadEvent: any) => {
        image.src = loadEvent.target.result;
        this.cropper.setImage(image);
    };

    myReader.readAsDataURL(file);
  }

  public preview() {
    swal({
      confirmButtonClass: 'button',
      confirmButtonText: 'Ok',
      imageUrl: this.data.image
    }).then(() => {
      // pass
    }, (dismiss: any) => {
      // pass
    });
  }

  public submitForm(value: Object): void {
    this.disabled = true;
    this.addProductSubscription = this.adminService.addProduct(value).subscribe(
      (res: genericInterface.RootObject) => {
        this.disabled = false;
        if (res.error === 'false') {
          this.router.navigate(['admin/products', { type: 'added' }]);
        } else {
          this.notificationsService.error('Onsuccesvol!', 'Er is een onbekende fout opgetreden, probeer het later noog eens.');
        }
      });
  }

  public trackByFn(index: number, item: categoriesInterface.RootObject): string {
    return(item._id);
  }
}

