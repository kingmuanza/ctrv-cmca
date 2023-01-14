import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'traduction'
})
export class TraductionPipe implements PipeTransform {

  transform(value: string): string {
    return value;
  }

}
