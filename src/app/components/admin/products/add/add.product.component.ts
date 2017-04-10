import { Component, OnInit, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

import { AdminService } from '../../../../services/admin.service';
import { MetaService } from '../../../../services/meta.service';
import { ProductService } from '../../../../services/product.service';

import { AdminGuard } from '../../../../guards/admin.guard';

import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-add-product',
  templateUrl: './add.product.component.html',
  styleUrls: ['./add.product.component.css']
})
export class AdminAddProductComponent implements OnInit {
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
  // tslint:disable-next-line:no-inferrable-types
  public msg: string = 'Product toevoegen';
  public categories: Array<Object>;

  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private metaService: MetaService,
              private adminService: AdminService,
              private adminGuard: AdminGuard) {
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
    this.metaService.removeTags();
    this.adminGuard.checkRemote();

    this.productService.categories().subscribe(
      (res) => {
        this.categories = res;
      }
    );

    this.addProductForm = this.formBuilder.group({
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
      'photo': [null, Validators.required]
    });
  }

  public cropped(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;

    this.addProductForm.get('photo').setValue(this.data.image);
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
    this.adminService.addProduct(value).subscribe(
      (res: any) => {
        this.disabled = false;
        if (res.error === 'false') {
          this.addProductForm = this.formBuilder.group({
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
            'photo': [null, Validators.required]
          });

          this.data = {};
        }

        this.msg = res.msg;
      });
  }
}

