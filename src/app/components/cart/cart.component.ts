import { Component, OnInit } from '@angular/core';

import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.pug',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  constructor(private metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.addTags();
  }
}
