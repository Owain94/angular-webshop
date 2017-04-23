import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'fixCurrency'
})
export class FixCurrencyPipe implements PipeTransform {
    transform(value: string, args: string[]): any {
    if (!value) {
      return value;
    }

    return value.replace(',', '').replace('.', ',');
  }
}
