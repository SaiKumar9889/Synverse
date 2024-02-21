import { Pipe, PipeTransform } from "@angular/core";
import Decimal from "decimal.js";

@Pipe({
  name: "decimalFormat",
})
export class DecimalFormatPipe implements PipeTransform {
  transform(value: number) {
    if (value === 0) {
      // Handle negative zero
      return value;
    } else {
      return value.toFixed(2);

      // Adjust the number of decimals as needed
    }
  }
}
