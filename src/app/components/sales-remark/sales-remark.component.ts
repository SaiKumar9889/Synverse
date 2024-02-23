import { Component, OnInit } from "@angular/core";
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
  selector: "app-sales-remark",
  templateUrl: "./sales-remark.component.html",
  styleUrls: ["./sales-remark.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SalesRemarkComponent implements OnInit {
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
      "yyyy/MM/dd"
    );
    console.log(this.searchFrom);
  }
  selectedToDate(date: any) {
    this.searchTo = this.datePipe.transform(this.dateTo.value, "yyyy/MM/dd");
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
        item.SALES_STATUS.toLowerCase().includes(filteredDataValue) ||
        item.SALES_STORE.toLowerCase().includes(filteredDataValue) ||
        item.SALES_CTRNO.toLowerCase().includes(filteredDataValue) ||
        item.SALES_DATETIME.toString().includes(filteredDataValue) ||
        item.SALES_RCPTNO.toString().includes(filteredDataValue) ||
        item.SALES_SHIFT.toLowerCase().includes(filteredDataValue) ||
        item.SALES_QTY.toString().includes(filteredDataValue) ||
        item.SALES_GROSS.toString().includes(filteredDataValue) ||
        item.SALES_NETSALES.toString().includes(filteredDataValue) ||
        item.SALES_TOT_COST.toString().includes(filteredDataValue)
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
    setTimeout(() => {
      if (this.selectedItems.includes("all")) {
        // this.storeIdValue = this.stores.map((item) => item.value).join();
        this.storeIdValue = "%5B%22SC01%22,%22SC02%22%5D";
        console.log(this.storeIdValue);
      } else {
        this.storeIdValue = event.value;
      }
    }, 500);
  }
  selectedItems: string[] = [];

  selectAll() {
    if (this.selectedItems.includes("all")) {
      this.selectedItems = this.stores.map((item) => item.value);
      this.selectedItems.push("all");
    } else {
      this.selectedItems.length = 0;
      this.selectedItems = [];
    }
  }

  // selectedTerminalId: any;
  terminalIdValue: string = "";
  selectedTerminalItems: string[] = [];
  terminalId: any[] = [{ value: "%5B%22T1%22%5D", viewValue: "Terminal 1" }];

  onTerminalChange(event: any): void {
    setTimeout(() => {
      if (this.selectedTerminalItems.includes("all")) {
        this.terminalIdValue = this.terminalId.map((item) => item.value).join();
      } else {
        this.terminalIdValue = event.value;
      }
    }, 500);
  }

  selectTerminalAll() {
    if (this.selectedTerminalItems.includes("all")) {
      this.selectedTerminalItems = this.terminalId.map((item) => item.value);
      this.selectedTerminalItems.push("all");
    } else {
      this.selectedTerminalItems.length = 0;
      this.selectedTerminalItems = [];
    }
  }

  isChecked: boolean;
  ngOnInit(): void {
    // Retrieve the stored checkbox state from localStorage
    const storedState = localStorage.getItem("checkboxState");

    // If a state is stored, use it; otherwise, default to false
    this.isChecked = storedState ? JSON.parse(storedState) : false;
    this.logCheckboxState();
  }

  isCheckbox: string;

  onCheckboxChange(event: any): void {
    this.isChecked = event.checked;

    // Store the checkbox state in localStorage
    localStorage.setItem("checkboxState", JSON.stringify(this.isChecked));

    // Print "true" or "false" based on the checkbox state
    this.logCheckboxState();
  }

  logCheckboxState(): void {
    // Print "true" or "false" based on the current checkbox state
    if (this.isChecked) {
      console.log("true");
      this.isCheckbox = "true";
    } else {
      console.log("false");
      this.isCheckbox = "false";
    }
  }
  errorMessage = null;
  salesRemark() {
    this.errorMessage = null;
    console.log(this.searchFrom);
    console.log(this.searchTo);
    this.appService
      .salesRemark(
        "json",
        this.searchFrom,
        this.searchTo,
        this.storeIdValue,
        this.terminalIdValue,
        this.isCheckbox
      )
      .subscribe((result) => {
        if (result && result.data == "failed") {
          console.log(result.message);
          // if (result.data && result.data.group_key) {
          this.errorMessage = result.message;
          console.log(this.errorMessage);
          // }
        }
        // this.store_code = result.data[0].store_code;
        // this.store_name = result.data[0].store_name;
        if (result) {
          this.filteredData = result.data.remark;
          console.log(this.filteredData[40].SALES_GROSS);
          this.storesFilterData = result.data.remark;
          // this.subTotalPriceLevelData = result.data[0].item_price.P1;
          this.subTotalData = result.data;
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
