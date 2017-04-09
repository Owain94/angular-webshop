import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyImageDirective } from './lazy.image.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LazyImageDirective
  ],
  exports: [
    LazyImageDirective
  ]
})
export class LazyImageModule { }
