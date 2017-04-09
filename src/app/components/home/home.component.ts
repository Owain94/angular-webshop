import { Component, OnInit } from '@angular/core';

import { ProductService } from '../../services/product.service';

import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public button: [string, string];
  public products: Array<Object>;

  constructor(private authGuard: AuthGuard,
              private productService: ProductService) {}

  ngOnInit(): void {
    if (!this.authGuard.check()) {
      this.button = ['/login', 'Aanmelden'];
    }

    this.productService.products(6).subscribe(
      (res) => {
        this.products = res;
      }
    );
  }
}
