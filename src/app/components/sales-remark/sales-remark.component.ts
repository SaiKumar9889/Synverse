import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../auth.service";
import { AppService } from "../../app.service";
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
  dateFrom: FormControl = new FormControl(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate()
    )
  );
  dateTo: FormControl = new FormControl(new Date());
  grandTotalData: any;
  filterValue: string = "";
  priceLevelFormFields: boolean = false;
  loadingSpinner: boolean;
  itemsPerPage = 5;
  currentPage = 1;
  totalPages: number;
  pagesToShow = 5;
  Math: any;
  firstDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    new Date().getDate()
  );
  secondDate = new Date();
  fromDate: any;
  toDate: any;
  itemsPerPageOptions = [5, 10, 15, 20, 50, 100];
  terminalDisabled: boolean = true;
  arrowUpOpen: boolean = true;

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private datePipe: DatePipe
  ) {
    // this.fromDate =
    //   this.firstDate.getFullYear() +
    //   "-" +
    //   (this.firstDate.getMonth() + 1) +
    //   "-" +
    //   this.firstDate.getDate();
    // this.toDate =
    //   this.secondDate.getFullYear() +
    //   "-" +
    //   (this.secondDate.getMonth() + 1) +
    //   "-" +
    //   this.secondDate.getDate();
    this.authService.login().subscribe((result) => {
      console.log(result);
      if (result && result.access_token) {
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.salesRemark("", "");
        this.getStore();
      }
    });
    this.selectedFormDate();
    this.selectedToDate();
  }
  formFieldsAdded() {
    this.priceLevelFormFields = true;
  }
  formFieldsRemoved() {
    this.priceLevelFormFields = false;
  }

  arrowOpen() {
    this.arrowUpOpen = false;
  }

  arrowClose() {
    this.arrowUpOpen = true;
  }

  title = "synverse";

  rowData = [];
  selectedFormDate() {
    this.searchFrom = this.datePipe.transform(
      this.dateFrom.value,
      "yyyy-MM-dd"
    );
    console.log(this.searchFrom);
  }
  selectedToDate() {
    this.searchTo = this.datePipe.transform(this.dateTo.value, "yyyy-MM-dd");
  }
  applyDateFilter() {
    this.itemsPerPage = 5;
    if (this.selectedDate === "custom") {
      this.salesRemark(this.searchFrom, this.searchTo);
    } else {
      this.salesRemark("", "");
    }
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

  storeIdValue: string[] = [];
  selectedStoreId: any;
  stores: any = [
    // { value: "01", viewValue: "DODO KOREA" },
    // { value: "SC01", viewValue: "Project Store" },
    // { value: "SC02", viewValue: "Project Store 2" },
  ];
  getStore() {
    this.appService.getStores().subscribe((result) => {
      this.stores = result;
      console.log(this.stores);
    });
  }
  onSelectionChange(event: any): void {
    setTimeout(() => {
      this.terminalDisabled = false;
      if (this.selectedItems.includes("all")) {
        this.storeIdValue = this.stores.map((item: any) => item.M_CODE);
        this.getTerminal();
      } else {
        this.storeIdValue = event.value;
        this.getTerminal();
      }
    }, 500);
  }
  selectedItems: string[] = [];

  selectAll() {
    if (this.selectedItems.includes("all")) {
      this.selectedItems = this.stores.map((item: any) => item.M_CODE);
      this.selectedItems.push("all");
    } else {
      this.selectedItems.length = 0;
      this.selectedItems = [];
    }
  }
  terminalIdValue: string[] = [];
  selectedTerminalItems: string[] = [];
  terminalId: any[] = [
    // { value: "T1", viewValue: "Terminal 1" }
  ];

  getTerminal() {
    this.appService.getTerminal(this.storeIdValue).subscribe((result) => {
      this.terminalId = result;
      console.log(this.terminalId);
    });
  }

  onTerminalChange(event: any): void {
    setTimeout(() => {
      if (this.selectedTerminalItems.includes("all")) {
        this.terminalIdValue = this.terminalId.map((item) => item.M_CODE);
      } else {
        this.terminalIdValue = event.value;
      }
    }, 500);
  }

  selectTerminalAll() {
    if (this.selectedTerminalItems.includes("all")) {
      this.selectedTerminalItems = this.terminalId.map((item) => item.M_CODE);
      this.selectedTerminalItems.push("all");
    } else {
      this.selectedTerminalItems.length = 0;
      this.selectedTerminalItems = [];
    }
  }

  isChecked: boolean;
  ngOnInit(): void {
    const storedState = localStorage.getItem("checkboxState");
    this.isChecked = storedState ? JSON.parse(storedState) : false;
    this.logCheckboxState();
  }

  isCheckbox: string;

  onCheckboxChange(event: any): void {
    this.isChecked = event.checked;
    localStorage.setItem("checkboxState", JSON.stringify(this.isChecked));
    this.logCheckboxState();
  }

  logCheckboxState(): void {
    if (this.isChecked) {
      console.log("true");
      this.isCheckbox = "true";
    } else {
      console.log("false");
      this.isCheckbox = "false";
    }
  }

  dateValue: string[] = ["lyear"];
  selectedDate: any = "lyear";
  dates: any = [
    { value: "today", viewValue: "Today" },
    { value: "yesterday", viewValue: "Yesterday" },
    { value: "lweek", viewValue: "Last Week" },
    { value: "lmth", viewValue: "Last Month" },
    { value: "lyear", viewValue: "Last Year" },
    { value: "custom", viewValue: "Custom Date" },
  ];
  onDateChange(event: any): void {
    this.dateValue = event.value;
    console.log(this.selectedDate);
  }

  errorMessage: any = null;
  salesRemark(fromDate: any, toDate: any) {
    this.loadingSpinner = true;
    this.appService
      .salesRemark(
        "json",
        fromDate,
        toDate,
        this.storeIdValue && this.storeIdValue.length
          ? JSON.stringify(this.storeIdValue)
          : "",
        this.terminalIdValue && this.terminalIdValue.length
          ? JSON.stringify(this.terminalIdValue)
          : "",
        this.isCheckbox,
        this.dateValue
      )
      .subscribe((result) => {
        if (result && result.data == "failed") {
          console.log(result.message);
          this.errorMessage = result.message;
          console.log(this.errorMessage);
        } else {
          this.errorMessage = null;
        }
        setTimeout(() => {
          if (result) {
            let array: any = [];
            // if (result.data !== "failed") {
            result?.data?.remark?.forEach((element: any) => {
              array.push({
                SALES_STATUS: element.SALES_STATUS,
                SALES_STORE: element.SALES_STORE,
                SALES_CTRNO: element.SALES_CTRNO,
                SALES_DATETIME: element.SALES_DATETIME,
                SALES_RCPTNO: element.SALES_RCPTNO,
                SALES_SHIFT: element.SALES_SHIFT,
                SALES_QTY: element.SALES_QTY,
                SALES_GROSS: element.SALES_GROSS,
                SALES_NETSALES: element.SALES_NETSALES,
                SALES_TOT_COST: element.SALES_TOT_COST,
              });
            });
            console.log(array);
            // }
            this.filteredData = array;
            this.storesFilterData = result.data.remark;
            this.subTotalData = result?.data;
            this.grandTotalData = result;
            // this.filteredData = this.storesFilterData;
            this.calculateTotalPages();
          }
          this.loadingSpinner = false;
        }, 1000);
      });
  }

  calculateTotalPages() {
    setTimeout(() => {
      console.log(this.filteredData);
      if (this.filteredData && this.itemsPerPage) {
        this.totalPages = Math.ceil(
          this.filteredData.length / this.itemsPerPage
        );
      }
      console.log(this.totalPages);
    }, 1000);
  }

  getCurrentPageItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getPageRange(): number[] {
    const startPage = Math.max(
      1,
      this.currentPage - Math.floor(this.pagesToShow / 2)
    );
    const endPage = Math.min(this.totalPages, startPage + this.pagesToShow - 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onItemsPerPageChange() {
    this.calculateTotalPages();
    this.currentPage = 1;
  }

  getDisplayRange(): string {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endIndex = Math.min(
      this.currentPage * this.itemsPerPage,
      this.filteredData.length
    );
    return `${startIndex} to ${endIndex}`;
  }
  shouldDisplayEllipsis(): boolean {
    return (
      this.totalPages > this.pagesToShow &&
      this.currentPage + Math.floor(this.pagesToShow / 2) < this.totalPages
    );
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
