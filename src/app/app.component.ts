import { Component } from '@angular/core';

import { FactorialService } from './services/factorial.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
// tslint:disable-next-line:no-inferrable-types
  public items = [];
  // tslint:disable-next-line:no-inferrable-types
  public progress: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  public computingFactorials: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public firstFactorial: number = 700;
  // tslint:disable-next-line:no-inferrable-types
  public numberOfFactorials: number = 50;

  constructor(private factorialService: FactorialService) {}

  public computeFactorials() {
    this.items = [];
    this.progress = 0;
    this.computingFactorials = true;

    for (let i = this.firstFactorial; i < this.firstFactorial + this.numberOfFactorials; i++) {
      setTimeout(this.getFactorialForN(i), 0);
    }
  }

  private getFactorialForN(i: number) {
    return () => {
      let value = this.factorialService.factorial(i);
      this.items = [...this.items, `${i} - ${value}`];
      this.progress += 100.0 / this.numberOfFactorials;
      console.log('progress: ', this.progress);

      if (i === this.firstFactorial + this.numberOfFactorials - 1 ) {
        this.computingFactorials = false;
      }
    };
  }

  public cleanResults() {
    this.items = [];
    this.progress = 0;
  }
}
