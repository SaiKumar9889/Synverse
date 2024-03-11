import { Component } from "@angular/core";
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
  selector: "app-receipt-analysis",
  templateUrl: "./receipt-analysis.component.html",
  styleUrls: ["./receipt-analysis.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ReceiptAnalysisComponent {
  [x: string]: any;
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
  constructor(
    private authService: AuthService,
    private appService: AppService,
    private datePipe: DatePipe
  ) {
    this.fromDate =
      this.firstDate.getFullYear() +
      "-" +
      (this.firstDate.getMonth() + 1) +
      "-" +
      this.firstDate.getDate();
    this.toDate =
      this.secondDate.getFullYear() +
      "-" +
      (this.secondDate.getMonth() + 1) +
      "-" +
      this.secondDate.getDate();
    this.authService.login().subscribe((result) => {
      if (result && result.access_token) {
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.receiptAnalysis(this.fromDate, this.toDate);
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
    this.receiptAnalysis(this.searchFrom, this.searchTo);
  }

  filteredData: any;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const filteredDataValue = filterValue.trim().toLowerCase();
    this.filteredData = this.storesFilterData.filter(
      (item: any) =>
        item.date.toLowerCase().includes(filteredDataValue) ||
        item.terminal.toLowerCase().includes(filteredDataValue) ||
        item.netsales.toString().includes(filteredDataValue) ||
        item.tax1.toString().includes(filteredDataValue) ||
        item.tax2.toString().includes(filteredDataValue) ||
        item.round.toString().includes(filteredDataValue) ||
        item.ttl_sales.toString().includes(filteredDataValue)
    );
    console.log(this.filteredData);
  }

  rows: any = [];
  columns: string[] = [];
  displayTable = false;
  storeIdValue: string[] = [];
  selectedStoreId: any;
  stores: any[] = [
    { value: "01", viewValue: "DODO KOREA" },
    { value: "SC01", viewValue: "Project Store" },
    { value: "SC02", viewValue: "Project Store 2" },
  ];
  onSelectionChange(event: any): void {
    setTimeout(() => {
      if (this.selectedItems.includes("all")) {
        this.storeIdValue = this.stores.map((item) => item.value);
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

  terminalIdValue: string[] = [];
  selectedTerminalItems: string[] = [];
  terminalId: any[] = [{ value: "T1", viewValue: "Terminal 1" }];

  onTerminalChange(event: any): void {
    setTimeout(() => {
      if (this.selectedTerminalItems.includes("all")) {
        this.terminalIdValue = this.terminalId.map((item) => item.value);
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

  term1: any;
  terminal: any;
  subTotalTerminal: any;

  isChecked: boolean;
  isCheckedCombine: boolean;
  isCheckedNormal: boolean;
  isCheckedRemark: boolean;

  ngOnInit(): void {
    const storedState = localStorage.getItem("checkboxState");
    this.isChecked = storedState ? JSON.parse(storedState) : false;
    this.logCheckboxState();
    const combinedState = localStorage.getItem("combineState");
    this.isCheckedCombine = combinedState ? JSON.parse(combinedState) : false;
    this.logCombineState();
    const normalState = localStorage.getItem("normalState");
    this.isCheckedNormal = normalState ? JSON.parse(normalState) : false;
    this.logNormalState();

    const remarkState = localStorage.getItem("remarkState");
    this.isCheckedRemark = remarkState ? JSON.parse(remarkState) : false;
    this.logRemarkState();
  }

  isCheckbox: string = "F";

  onCheckboxChange(event: any): void {
    this.isChecked = event.checked;
    localStorage.setItem("checkboxState", JSON.stringify(this.isChecked));
    this.logCheckboxState();
  }

  logCheckboxState(): void {
    if (this.isChecked) {
      console.log("true");
      this.isCheckbox = "T";
    } else {
      console.log("false");
      this.isCheckbox = "F";
    }
  }
  isCombine: string = "F";

  onCombineChange(event: any): void {
    this.isCheckedCombine = event.checked;
    localStorage.setItem("combineState", JSON.stringify(this.isCheckedCombine));
    this.logCombineState();
  }

  logCombineState(): void {
    if (this.isCheckedCombine) {
      console.log("true");
      this.isCombine = "T";
    } else {
      console.log("false");
      this.isCombine = "F";
    }
  }

  isNormal: string = "F";

  onNormalChange(event: any): void {
    this.isCheckedNormal = event.checked;
    localStorage.setItem("normalState", JSON.stringify(this.isCheckedNormal));
    this.logNormalState();
  }

  logNormalState(): void {
    if (this.isCheckedNormal) {
      console.log("true");
      this.isNormal = "T";
    } else {
      console.log("false");
      this.isNormal = "F";
    }
  }

  isRemark: string = "F";

  onRemarkChange(event: any): void {
    this.isCheckedRemark = event.checked;
    localStorage.setItem("remarkState", JSON.stringify(this.isCheckedRemark));
    this.logRemarkState();
  }

  logRemarkState(): void {
    if (this.isCheckedRemark) {
      console.log("true");
      this.isRemark = "T";
    } else {
      console.log("false");
      this.isRemark = "F";
    }
  }
  errorMessage: any = null;
  receiptAnalysis(fromDate: any, toDate: any) {
    this.loadingSpinner = true;
    console.log(this.storeIdValue);
    this.appService
      .receiptAnalysis(
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
        this.isCombine,
        this.isNormal,
        this.isRemark
      )
      .subscribe((result) => {
        if (result && result.data == "") {
          console.log(result.message);
          this.errorMessage = "No Data Found";
          console.log(this.errorMessage);
        } else {
          this.errorMessage = null;
        }
        this.store_code = result?.data[0]?.terminal_code;
        this.store_name = result?.data[0]?.terminal_desc;
        setTimeout(() => {
          if (result) {
            this.storeData = result?.data;

            this.storesFilterData = result?.data;
            this.subTotalTerminal = result?.data[0]?.terminal[0];
            this.subTotalData = result?.data[0];
            this.grandTotalData = result;
            if (this.storeIdValue[0] === "SC01") {
              this.filteredData = result?.data[0]?.terminal[0]?.detail;
            } else {
              this.filteredData = result?.data[1]?.terminal[0]?.detail;
            }

            console.log(this.filteredData);
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
