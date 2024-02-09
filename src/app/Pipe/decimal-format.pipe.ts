import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "decimalFormat",
})
export class DecimalFormatPipe implements PipeTransform {
  transform(value: number): string {
    // Format the number to display up to two decimal places
    return value?.toFixed(2);
  }
}
