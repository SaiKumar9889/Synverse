import { Component } from "@angular/core";
import { ColDef } from "ag-grid-community";
import { AuthService } from "../../auth.service";
import { AppService } from "../../app.service";
import { CurrencyRenderer } from "../../utils/app.util";
import { MatTableDataSource } from "@angular/material/table";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";

import * as _moment from "moment";
import { FormControl } from "@angular/forms";
import { DatePipe } from "@angular/common";

export const MY_FORMATS = {
  parse: {
    dateInput: "LL",
  },
  display: {
    dateInput: "DD-MM-YYYY",
    monthYearLabel: "YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "YYYY",
  },
};

@Component({
  selector: "app-price-level-shift",
  templateUrl: "./price-level-shift.component.html",
  styleUrls: ["./price-level-shift.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PriceLevelShiftComponent {
  store_code: any;
  store_name: any;
  storeData: any = [];
  storesFilterData: any = [];
  subTotalPriceLevelData: any;
  subTotalData: any;
  searchFrom: any = "";
  searchTo: any = "";
  dateFrom: FormControl = new FormControl();
  dateTo: FormControl = new FormControl();
  grandTotalData: any;
  filterValue: string = "";
  priceLevelFormFields: boolean = false;
  loadingSpinner: boolean = true;

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private datePipe: DatePipe
  ) {
    this.authService.login().subscribe((result) => {
      if (result && result.access_token) {
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.itemreportbypricelevelshift();
      }
    });
  }
  formFieldsAdded() {
    this.priceLevelFormFields = true;
  }
  formFieldsRemoved() {
    this.priceLevelFormFields = false;
  }

  title = "synverse";

  rowData = [];
  selectedFormDate(date: any) {
    this.searchFrom = this.datePipe.transform(
      this.dateFrom.value,
      "yyyy/MM/dd"
    );
    console.log(this.searchFrom);
  }
  selectedToDate(date: any) {
    this.searchTo = this.datePipe.transform(this.dateTo.value, "yyyy/MM/dd");
  }
  applyDateFilter() {
    this.itemreportbypricelevelshift();
    setTimeout(() => {
      this.loadingSpinner = true;
    }, 1000);
  }

  filteredData: any;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const filteredDataValue = filterValue.trim().toLowerCase();
    this.filteredData = this.storesFilterData.filter(
      (item: any) =>
        item.SDTL_SHORTDESC.toLowerCase().includes(filteredDataValue) ||
        item.SDTL_QTY.toString().includes(filteredDataValue) ||
        item.SDTL_STOCK_CODE.toLowerCase().includes(filteredDataValue) ||
        item.SDTL_GROSS.toString().includes(filteredDataValue) ||
        item.SDTL_DISC.toString().includes(filteredDataValue) ||
        item.SDTL_NETSALES.toString().includes(filteredDataValue)
    );
  }

  storeIdValue: string = "";
  selectedStoreId: any;
  stores: any[] = [
    { value: "%5B%22SC01%22%5D", viewValue: "Project Store" },
    { value: "%5B%22SC02%22%5D", viewValue: "Project Store 2" },
  ];
  onSelectionChange(event: any): void {
    this.storeIdValue = event.value;
    console.log("Selection change event:", event.value);
  }

  selectedPaymentId: any;
  paymentIdValue: string = "";
  paymentId: any[] = [
    { value: "%5B%22P1%22%5D", viewValue: "WEST MSIA" },
    { value: "%5B%22P2%22%5D", viewValue: "EAST MSIA" },
    { value: "%5B%22P3%22%5D", viewValue: "Price Lvl 3" },
    { value: "%5B%22P4%22%5D", viewValue: "Price Lvl 4" },
    { value: "%5B%22P5%22%5D", viewValue: "Price Lvl 5" },
    { value: "%5B%22P6%22%5D", viewValue: "Price Lvl 6" },
    { value: "%5B%22P7%22%5D", viewValue: "Price Lvl 7" },
    { value: "%5B%22P8%22%5D", viewValue: "Price Lvl 8" },
    { value: "%5B%22P9%22%5D", viewValue: "Price Lvl 9" },
  ];
  onPaymentChange(event: any): void {
    this.paymentIdValue = event.value;
    console.log("Selection change event:", event.value);
  }
  selectedStockId: any;
  stockIdValue: string = "";
  stockId: any[] = [
    { value: "%5B%22SC01%22%5D", viewValue: "NASI AYAM" },
    { value: "%5B%22SC02%22%5D", viewValue: "NASI GORENG AYAM" },
    { value: "%5B%22SC03%22%5D", viewValue: "MEE CURRY" },
    { value: "%5B%22SC04%22%5D", viewValue: "CHICKEN CHOP" },
    { value: "%5B%22SC05%22%5D", viewValue: "ICE CREAM SCOOP" },
    { value: "%5B%22SC07%22%5D", viewValue: "CHOCOLATE AIS" },
    { value: "%5B%22SC10%22%5D", viewValue: "Single Set Menu" },
    { value: "%5B%22SC11%22%5D", viewValue: "Enter Set Menu" },
    { value: "%5B%22SC12%22%5D", viewValue: "All Set Menu" },
  ];
  onStockChange(event: any): void {
    this.stockIdValue = event.value;
    console.log("Selection change event:", event.value);
  }

  selectedShiftId: any;
  shiftIdValue: string = "%5B%22S1%22%5D";
  shiftId: any[] = [
    { value: "%5B%22S1%22%5D", viewValue: "NORMAL" },
    { value: "%5B%22S2%22%5D", viewValue: "MEMBER" },
    { value: "%5B%22S3%22%5D", viewValue: "DEALER" },
    { value: "%5B%22S4%22%5D", viewValue: "Price shift 4" },
    { value: "%5B%22S5%22%5D", viewValue: "Price shift 5" },
    { value: "%5B%22S6%22%5D", viewValue: "Price shift 6" },
    { value: "%5B%22S7%22%5D", viewValue: "Price shift 7" },
    { value: "%5B%22S8%22%5D", viewValue: "Price shift 8" },
    { value: "%5B%22S9%22%5D", viewValue: "Price shift 9" },
  ];
  onShiftChange(event: any): void {
    this.shiftIdValue = event.value;
    console.log("Selection change event:", event.value);
  }

  itemreportbypricelevelshift() {
    this.appService
      .itemreportbypricelevelshift(
        "json",
        this.searchFrom,
        this.searchTo,
        this.storeIdValue,
        this.paymentIdValue,
        this.stockIdValue,
        this.shiftIdValue
      )
      .subscribe((result) => {
        if (result) {
          this.store_code = result?.data[0]?.store_code;
          this.store_name = result?.data[0]?.store_name;
          this.storeData = result?.data[0]?.item_price.P1.data;
          this.storesFilterData = result?.data[0]?.item_price?.P1?.data;
          this.subTotalPriceLevelData = result?.data[0]?.item_price?.P1;
          this.subTotalData = result?.data[0];
          this.grandTotalData = result;
          this.filteredData = this.storesFilterData;
          console.log(this.filteredData);
          this.loadingSpinner = false;
        }
      });
  }

  columnToSort = "";
  sortDirection = "asc";

  sortTable(columnName: string): void {
    if (this.columnToSort === columnName) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.columnToSort = columnName;
      this.sortDirection = "asc";
    }

    this.storesFilterData.sort((a: any, b: any) => {
      const direction = this.sortDirection === "asc" ? 1 : -1;
      return a[columnName] > b[columnName] ? direction : -direction;
    });
  }
}
