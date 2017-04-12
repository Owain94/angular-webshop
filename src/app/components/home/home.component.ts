import { Component, OnInit } from '@angular/core';

import { AutoUnsubscribe } from '../../decorators/auto.unsubscribe.decorator';

import { ProductService } from '../../services/product.service';
import { MetaService } from '../../services/meta.service';

import { AuthGuard } from '../../guards/auth.guard';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

@AutoUnsubscribe()
export class HomeComponent implements OnInit {
  public button: [string, string];
  public products: Array<Array<Object>>;

  private productSubscription: Subscription;

  private static spliceArray(arr: Array<Object>): Array<Array<Object>> {
    const outArray = [];

    while (arr.length > 0) {
      outArray.push(arr.splice(0, 3));
    }

    return outArray;
  }

  constructor(private authGuard: AuthGuard,
              private productService: ProductService,
              private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.addTags();

    if (!this.authGuard.check()) {
      this.button = ['/login', 'Aanmelden'];
    }

    this.productSubscription = this.productService.products(6).subscribe(
      (res) => {
        this.products = HomeComponent.spliceArray(res);
        console.log(this.products);
      }
    );
  }

  public trackByIFn(index: number, item): number {
    return(index);
  }

  public trackByFn(index: number, item): string {
    return(item._id);
  }
}
