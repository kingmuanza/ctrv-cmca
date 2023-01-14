import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombre'
})
export class NombrePipe implements PipeTransform {

  constructor(
    public currencyPipe: CurrencyPipe
    ) {
  }

  transform(value: number): string | null{
    return this.currencyPipe.transform(value, ' ', false, '0.0-1', 'fr-FR');
  }

}
