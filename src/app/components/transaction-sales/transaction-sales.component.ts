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
  selector: "app-transaction-sales",
  templateUrl: "./transaction-sales.component.html",
  styleUrls: ["./transaction-sales.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TransactionSalesComponent {
  store_code: any;
  store_name: any;
  storeData: any = [];
  storesFilterData: any = [];
  subTotalPriceLevelData: any;
  subTotalData: any;
  searchFrom: any = "2019-03-01";
  searchTo: any = "2023-05-31";
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
      console.log(result);
      if (result && result.access_token) {
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.transactionSales();
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
      "yyyy-MM-dd"
    );
    console.log(this.searchFrom);
  }
  selectedToDate(date: any) {
    this.searchTo = this.datePipe.transform(this.dateTo.value, "yyyy-MM-dd");
  }
  applyDateFilter() {
    this.transactionSales();
  }

  filteredData: any;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const filteredDataValue = filterValue.trim().toLowerCase();
    this.filteredData = this.storesFilterData.filter(
      (item: any) =>
        item.stock_code.toLowerCase().includes(filteredDataValue) ||
        item.barcode.toLowerCase().includes(filteredDataValue) ||
        item.shortdesc.toLowerCase().includes(filteredDataValue) ||
        item.uom.toLowerCase().includes(filteredDataValue) ||
        item.stk_group.toLowerCase().includes(filteredDataValue) ||
        item.stk_department.toLowerCase().includes(filteredDataValue) ||
        item.stk_category.toLowerCase().includes(filteredDataValue) ||
        item.qty.toString().includes(filteredDataValue) ||
        item.netprice.toString().includes(filteredDataValue) ||
        item.discbymny.toString().includes(filteredDataValue)
    );
    console.log(this.filteredData);
  }

  storeIdValue: string = "SC01";
  selectedStoreId: any;
  stores: any[] = [
    { value: "%5B%22SC01%22%5D", viewValue: "Project Store" },
    { value: "%5B%22SC02%22%5D", viewValue: "Project Store 2" },
  ];
  onSelectionChange(event: any): void {
    this.storeIdValue = event.value;
    console.log("Selection change event:", event.value);
  }

  transactionSales() {
    console.log(this.searchFrom);
    console.log(this.searchTo);
    this.appService
      .transactionSales(
        "json",
        this.searchFrom,
        this.searchTo,
        this.storeIdValue
      )
      .subscribe((result) => {
        // this.store_code = result.data[0].store_code;
        // this.store_name = result.data[0].store_name;
        if (result) {
          this.filteredData = result.data;
          console.log(result);
          this.storesFilterData = result.data;
          // this.subTotalPriceLevelData = result.data[0].item_price.P1;
          // this.subTotalData = result.data;
          this.grandTotalData = result;
          this.filteredData = this.storesFilterData;
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
