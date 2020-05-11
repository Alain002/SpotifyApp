import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'roundHalf'
})

export class RoundPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    /* To round to nearest half */
    return Math.round(value * 2) / 2;
  }

}
