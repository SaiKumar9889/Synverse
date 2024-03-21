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
  selector: "app-tax-transaction",
  templateUrl: "./tax-transaction.component.html",
  styleUrls: ["./tax-transaction.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TaxTransactionComponent implements OnInit {
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
  store_id: any;
  storeId: string = "%5B%22SC01%22%5D";
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
  minDate: Date = new Date();

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
      if (result && result.access_token) {
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.taxTransaction("", "");
        this.getStore();
      }
    });
    this.selectedFormDate();
    this.selectedToDate();
    this.minDate = this.calculateMinDate();
    console.log(this.minDate);
  }
  calculateMinDate(): Date {
    const today = new Date();
    return new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
  }
  formFieldsAdded() {
    this.priceLevelFormFields = true;
  }
  formFieldsRemoved() {
    this.priceLevelFormFields = false;
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
      this.taxTransaction(this.searchFrom, this.searchTo);
    } else {
      this.taxTransaction("", "");
    }
  }

  filteredData: any;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const filteredDataValue = filterValue.trim().toLowerCase();
    this.filteredData = this.storesFilterData.filter(
      (item: any) =>
        item.store.toLowerCase().includes(filteredDataValue) ||
        item.terminal.toLowerCase().includes(filteredDataValue) ||
        item.date.toString().includes(filteredDataValue) ||
        item.rcpt.toString().includes(filteredDataValue) ||
        item.operator.toString().includes(filteredDataValue) ||
        item.shift.toLowerCase().includes(filteredDataValue) ||
        item.status.toLowerCase().includes(filteredDataValue) ||
        item.gross.toString().includes(filteredDataValue) ||
        item.tax1.toString().includes(filteredDataValue) ||
        item.tax2.toString().includes(filteredDataValue) ||
        item.tax3.toString().includes(filteredDataValue) ||
        item.tax4.toString().includes(filteredDataValue) ||
        item.netSales.toString().includes(filteredDataValue)
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

  isChecked: boolean;
  ngOnInit(): void {
    const storedState = localStorage.getItem("checkboxState");
    this.isChecked = storedState ? JSON.parse(storedState) : false;
    this.logCheckboxState();
  }

  isCheckbox: string = "T";

  onCheckboxChange(event: any): void {
    this.isChecked = event.checked;
    localStorage.setItem("checkboxState", JSON.stringify(this.isChecked));
    this.logCheckboxState();
  }

  logCheckboxState(): void {
    if (this.isChecked) {
      this.isCheckbox = "T";
    } else {
      this.isCheckbox = "F";
    }
  }
  errorMessage = null;
  taxTransaction(fromDate: any, toDate: any) {
    this.loadingSpinner = true;
    this.errorMessage = null;
    this.appService
      .taxTransaction(
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
        if (result && result.success == false) {
          console.log(result.message);
          this.errorMessage = result.message;
          console.log(this.errorMessage);
        } else {
          this.errorMessage = null;
        }
        setTimeout(() => {
          if (result) {
            // this.store_code = result?.data[0]?.store_code;
            // this.store_name = result?.data[0]?.store_name;
            let array: any = [];
            if (result.data !== "failed") {
              result?.data?.forEach((element: any) => {
                element?.tax_trx?.forEach((element1: any) => {
                  array.push({
                    store: element1.store,
                    terminal: element1.terminal,
                    date: element1.date,
                    rcpt: element1.rcpt,
                    operator: element1.operator,
                    shift: element1.shift,
                    status: element1.status,
                    gross: element1.gross,
                    tax1: element1.tax1,
                    tax2: element1.tax2,
                    tax3: element1.tax3,
                    tax4: element1.tax4,
                    netSales: element1.netSales,
                  });
                });
              });
              console.log(array);
            }
            this.filteredData = array;
            this.storesFilterData = result?.data[0]?.tax_trx;
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
