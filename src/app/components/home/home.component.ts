/// <reference path="../../interfaces/products/products.interface.ts" />

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Log } from '../../decorators/log.decorator';
import { AutoUnsubscribe } from '../../decorators/auto.unsubscribe.decorator';

import { ProductService } from '../../services/product.service';
import { MetaService } from '../../services/meta.service';

import { AuthGuard } from '../../guards/auth.guard';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.pug',
  styleUrls: ['./home.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Log()
@AutoUnsubscribe()
export class HomeComponent implements OnInit, OnDestroy {
  public button: [string, string];
  public products: productsInterface.RootObject;

  private productSubscription: Subscription;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private authGuard: AuthGuard,
              private productService: ProductService,
              private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.addTags();

    if (!this.authGuard.check()) {
      this.button = ['/login', 'Aanmelden'];
    }

    this.productSubscription = this.productService.products(6).subscribe(
      (res: productsInterface.RootObject) => {
        this.products = res;
        this.changeDetectorRef.markForCheck();
      }
    );
  }

  ngOnDestroy(): void {
    // pass
  }

  public trackByFn(index: number, item: productsInterface.RootObject): string {
    return(item._id);
  }
}
