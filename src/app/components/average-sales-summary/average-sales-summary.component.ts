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
  selector: "app-average-sales-summary",
  templateUrl: "./average-sales-summary.component.html",
  styleUrls: ["./average-sales-summary.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AverageSalesSummaryComponent {
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
  storeIdValue: string = "";

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private datePipe: DatePipe
  ) {
    this.authService.login().subscribe((result) => {
      if (result && result.access_token) {
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.averageSalesSummary();
      }
    });
  }
  selectedStoreId: any;
  foods: any[] = [
    { value: "%5B%22SC01%22%5D", viewValue: "SC01" },
    { value: "%5B%22SC02%22%5D", viewValue: "SC02" },
  ];
  onSelectionChange(event: any): void {
    this.storeIdValue = event.value;
    console.log("Selection change event:", event.value);
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
    this.averageSalesSummary();
  }

  filteredData: any;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const filteredDataValue = filterValue.trim().toLowerCase();
    this.filteredData = this.storesFilterData.filter(
      (item: any) =>
        item.CI_CLOSEDATE.toLowerCase().includes(filteredDataValue) ||
        item.CI_DAY.toLowerCase().includes(filteredDataValue) ||
        item.F_SALES_DINEIN.toString().includes(filteredDataValue) ||
        item.F_BILL_DINEIN.toString().includes(filteredDataValue) ||
        item.AVG_DINEIN.toString().includes(filteredDataValue) ||
        item.F_SALES_TABLE.toString().includes(filteredDataValue) ||
        item.F_BILL_TABLE.toString().includes(filteredDataValue) ||
        item.AVG_TABLE.toString().includes(filteredDataValue) ||
        item.F_PAX_TABLE.toString().includes(filteredDataValue) ||
        item.AVG_PAX_TABLE.toString().includes(filteredDataValue) ||
        item.F_SALES_TAKEAWAY.toString().includes(filteredDataValue) ||
        item.F_BILL_TAKEAWAY.toString().includes(filteredDataValue) ||
        item.AVG_TAKEAWAY.toString().includes(filteredDataValue) ||
        item.F_SALES_DELIVERY.toString().includes(filteredDataValue) ||
        item.F_BILL_DELIVERY.toString().includes(filteredDataValue) ||
        item.AVG_DELIVERY.toString().includes(filteredDataValue)
    );
    console.log(this.filteredData);
  }

  averageSalesSummary() {
    console.log(this.storeIdValue);
    this.appService
      .averageSalesSummary(
        "json",
        this.searchFrom,
        this.searchTo,
        this.storeIdValue
      )
      .subscribe((result) => {
        this.store_code = result.data[0].store_code;
        this.store_name = result.data[0].store_desc;
        if (result) {
          this.filteredData = result.data[0].average_sales;
          this.storesFilterData = result.data[0].average_sales;
          // this.subTotalPriceLevelData = result.data[0].item_price.P1;
          this.subTotalData = result.data[0];
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
