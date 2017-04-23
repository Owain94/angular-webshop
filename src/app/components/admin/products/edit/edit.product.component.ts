/// <reference path="../../../../interfaces/generic.interface.ts" />
/// <reference path="../../../../interfaces/products/products.interface.ts" />
/// <reference path="../../../../interfaces/products/categories.interface.ts" />

import { url } from './../../../../../constants';
import { Component, OnInit, ViewChild, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

import { AutoUnsubscribe } from '../../../../decorators/auto.unsubscribe.decorator';

import { AdminService } from '../../../../services/admin.service';
import { MetaService } from '../../../../services/meta.service';
import { ProductService } from '../../../../services/product.service';
import { NotificationsService } from '../../../../services/notifications.service';

import { AdminGuard } from '../../../../guards/admin.guard';

import { Subscription } from 'rxjs/Rx';

import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-edit-product',
  templateUrl: './edit.product.component.pug',
  styleUrls: ['./edit.product.component.css']
})

@AutoUnsubscribe()
export class AdminEditProductComponent implements OnInit {
  @ViewChild('cropper') cropper: ImageCropperComponent;

  public data: any;
  public cropperSettings: CropperSettings;
  public croppedWidth: number;
  public croppedHeight: number;
  // tslint:disable-next-line:no-inferrable-types
  public showDialog: boolean = false;
  public editProductForm: FormGroup;
  // tslint:disable-next-line:no-inferrable-types
  public disabled: boolean = false;
  public categories: categoriesInterface.RootObject;

  private routeParamSubscription: Subscription;
  private productSubscription: Subscription;
  private categoriesSubscription: Subscription;
  private updateProductSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private adminService: AdminService,
              private metaService: MetaService,
              private adminGuard: AdminGuard,
              private route: ActivatedRoute,
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
    this.metaService.addTags();
    this.adminGuard.checkRemote();

    this.routeParamSubscription = this.route.params.subscribe(params => {
      const id = params['id'];

      this.productSubscription = this.productService.product(id).subscribe(
        (res: productsInterface.RootObject) => {
          this.editProductForm.get('name').setValue(res.name);
          this.editProductForm.get('category').setValue(res.category);
          this.editProductForm.get('description').setValue(res.description);
          this.editProductForm.get('photo').setValue(res.photo);
          this.editProductForm.get('price').setValue(res.price);
          this.editProductForm.get('amount').setValue(res.amount);

          this.editProductForm.get('id').setValue(id);
          this.data.image = res.photo;

          const image: any = new Image();

          this.toDataUrl(`${url}/assets/products/${res.photo}`, (base64: string) => {
            image.src = base64;
            this.cropper.setImage(image);
          });
        }
      );
    });

    this.categoriesSubscription = this.productService.categories().subscribe(
      (res: categoriesInterface.RootObject) => {
        this.categories = res;
      }
    );

    this.editProductForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'category': [null, Validators.required],
      'amount': [-1, Validators.required],
      'price': [null,
        [
          Validators.required,
          Validators.pattern(/(?:^\d{1,3}(?:\.?\d{3})*(?:,\d{2})?$)|(?:^\d{1,3}(?:,?\d{3})*(?:\.\d{2})?$)/)
        ]
      ],
      'description': [null, Validators.required],
      'photo': [null, Validators.required],
      'id': [null, Validators.required]
    });
  }

  private toDataUrl(url: string, callback: any) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
      const reader = new FileReader();
      reader.onloadend = function() {
          callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };

    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

  public cropped(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;

    this.editProductForm.get('photo').setValue(this.data.image);
  }

  public fileChangeListener($event) {
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
    }, (dismiss) => {
      // pass
    });
  }

  public submitForm(value: Object): void {
    this.disabled = true;
    this.updateProductSubscription = this.adminService.updateProduct(value).subscribe(
      (res: genericInterface.RootObject) => {
        this.disabled = false;
        if (res.error === 'false') {
          this.router.navigate(['admin/products', { type: 'edited' }]);
        } else {
          this.notificationsService.error('Onsuccesvol!', 'Er is een onbekende fout opgetreden, probeer het later noog eens.');
        }
      });
  }

  public trackByFn(index: number, item): string {
    return(item._id);
  }
}

