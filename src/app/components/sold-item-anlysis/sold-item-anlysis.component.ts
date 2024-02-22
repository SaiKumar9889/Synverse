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
  selector: "app-sold-item-anlysis",
  templateUrl: "./sold-item-anlysis.component.html",
  styleUrls: ["./sold-item-anlysis.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SoldItemAnlysisComponent {
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
  terminal_code: any;
  terminal_name: any;
  subTotalTerminal: any;

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
        this.salesRemark();
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
    this.salesRemark();
  }

  filteredData: any;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const filteredDataValue = filterValue.trim().toLowerCase();
    this.filteredData = this.storesFilterData.filter(
      (item: any) =>
        item.detail.SDTL_SALES_RCPTNO.toString().includes(filteredDataValue) ||
        item.detail.SDTL_STOCK_CODE.toLowerCase().includes(filteredDataValue) ||
        item.detail.SDTL_SHORTDESC.toLowerCase().includes(filteredDataValue) ||
        item.detail.SDTL_SALES_PRICELVL.toLowerCase().includes(
          filteredDataValue
        ) ||
        item.detail.SDTL_SALES_PRICE_SHIFT.toLowerCase().includes(
          filteredDataValue
        ) ||
        item.detail.SDTL_STATUS.toLowerCase().includes(filteredDataValue) ||
        item.detail.SDTL_QTY.toString().includes(filteredDataValue) ||
        item.detail.SDTL_GROSS.toString().includes(filteredDataValue) ||
        item.detail.SDTL_DISCAMT.toString().includes(filteredDataValue) ||
        item.detail.SDTL_NETT.toString().includes(filteredDataValue) ||
        item.detail.SDTL_CHANGEPRC.toString().includes(filteredDataValue)
    );
    console.log(this.filteredData);
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

  selectedTerminalId: any;
  terminalIdValue: string = "";
  terminalId: any[] = [{ value: "%5B%22T1%22%5D", viewValue: "Terminal 1" }];
  onTerminalChange(event: any): void {
    this.terminalIdValue = event.value;
    console.log("Selection change event:", event.value);
  }

  salesRemark() {
    console.log(this.searchFrom);
    console.log(this.searchTo);
    this.appService
      .soldItemAnalysis(
        this.searchFrom,
        this.searchTo,
        this.storeIdValue,
        this.terminalIdValue
      )
      .subscribe((result) => {
        if (result || result == null || result == undefined) {
          this.store_code = result?.data[0]?.store_code;
          this.store_name = result?.data[0]?.store_desc;
          this.terminal_code = result?.data[0]?.sold_item[0]?.terminal_code;
          this.terminal_name = result?.data[0]?.sold_item[0]?.terminal_desc;
          this.filteredData = Object.values(
            result?.data[0]?.sold_item[0]?.data || {}
          );
          console.log(this.filteredData);
          this.storesFilterData = Object.values(
            result?.data[0]?.sold_item[0]?.data || {}
          );
          this.subTotalTerminal = result?.data[0]?.sold_item[0];
          this.subTotalData = result?.data[0];
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
