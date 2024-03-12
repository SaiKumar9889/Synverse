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
  selector: "app-payment-type",
  templateUrl: "./payment-type.component.html",
  styleUrls: ["./payment-type.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PaymentTypeComponent implements OnInit {
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
  terminal_code: any;
  terminal_name: any;
  subTotalTerminal: any;
  isChecked: boolean;
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
    console.log(this.fromDate, this.toDate);
    this.authService.login().subscribe((result) => {
      if (result && result.access_token) {
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.paymentType(this.fromDate, this.toDate);
        this.getStore();
        this.getPayment();
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
    this.paymentType(this.searchFrom, this.searchTo);
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
    this.terminalDisabled = false;
    setTimeout(() => {
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

  selectedPaymentId: any;
  paymentIdValue: string[] = [];
  paymentId: any[] = [
    // { value: "MASTER", viewValue: "MASTER" },
    // { value: "PC01", viewValue: "Payment 1" },
    // { value: "VISA", viewValue: "VISA" },
  ];
  getPayment() {
    this.appService.getPayment().subscribe((result) => {
      this.paymentId = result;
      console.log(this.paymentId);
    });
  }
  onPaymentChange(event: any): void {
    setTimeout(() => {
      if (this.selectedPaymentItems.includes("all")) {
        this.paymentIdValue = this.paymentId.map((item) => item.M_CODE);
      } else {
        this.paymentIdValue = event.value;
      }
    }, 500);
  }
  selectedPaymentItems: string[] = [];

  selectPaymentAll() {
    if (this.selectedPaymentItems.includes("all")) {
      this.selectedPaymentItems = this.paymentId.map((item) => item.M_CODE);
      this.selectedPaymentItems.push("all");
    } else {
      this.selectedPaymentItems.length = 0;
      this.selectedPaymentItems = [];
    }
  }
  isCheckedShift: boolean;
  ngOnInit(): void {
    const storedState = localStorage.getItem("checkboxState");
    this.isChecked = storedState ? JSON.parse(storedState) : false;

    const shiftState = localStorage.getItem("checkboxState");
    this.isCheckedShift = shiftState ? JSON.parse(shiftState) : false;
    this.logCheckboxState();
    this.shiftCheckboxState();
  }

  isCheckbox: string;
  isCheckboxShift: string;
  onCheckboxChange(event: any): void {
    this.isChecked = event.checked;
    localStorage.setItem("checkboxState", JSON.stringify(this.isChecked));
    this.logCheckboxState();
  }

  onShiftChange(event: any): void {
    this.isCheckedShift = event.checked;
    localStorage.setItem("checkboxState", JSON.stringify(this.isCheckedShift));
    this.shiftCheckboxState();
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
  shiftCheckboxState(): void {
    if (this.isCheckedShift) {
      console.log("true");
      this.isCheckboxShift = "true";
    } else {
      console.log("false");
      this.isCheckboxShift = "false";
    }
  }
  errorMessage = null;
  paidAmount: any;
  roundAdj: any;
  visaData: any;
  visaDataSubtotal: any;
  masterData: any;
  masterDataSubtotal: any;
  subTotalDataT1: any;
  subTotalT1: any;
  filteredDataT2: any;
  paidAmountT2: any;
  subTotalDataT2: any;
  subTotalT2: any;
  filteredDataT3: any;
  paidAmountT3: any;
  subTotalDataT3: any;
  subTotalT3: any;

  filteredDataT4: any;
  paidAmountT4: any;
  subTotalDataT4: any;
  subTotalT4: any;

  filteredDataT5: any;
  paidAmountT5: any;
  subTotalDataT5: any;
  subTotalT5: any;

  filteredDataT6: any;
  paidAmountT6: any;
  subTotalDataT6: any;
  subTotalT6: any;
  subTotalSC01: any;
  paymentType(fromDate: any, toDate: any) {
    this.loadingSpinner = true;
    this.errorMessage = null;
    this.appService
      .paymentType(
        "json",
        fromDate,
        toDate,
        this.storeIdValue && this.storeIdValue.length
          ? JSON.stringify(this.storeIdValue)
          : "",
        this.terminalIdValue && this.terminalIdValue.length
          ? JSON.stringify(this.terminalIdValue)
          : "",
        this.paymentIdValue && this.paymentIdValue.length
          ? JSON.stringify(this.paymentIdValue)
          : "",
        this.isCheckbox,
        this.isCheckboxShift
      )
      .subscribe(async (result) => {
        if (result && result.success == false) {
          // if (result.data && result.data.group_key) {
          this.errorMessage = result?.message;
          // }
        } else {
          this.errorMessage = null;
        }
        setTimeout(() => {
          if (result) {
            this.store_code = result?.data[0]?.store_code;
            this.store_name = result?.data[0]?.store_name;

            this.filteredData = Object.values(
              result?.data[0]?.payment?.["Payment 1"] || {}
            );
            if (this.filteredData !== undefined) {
              // Your code to handle the non-undefined paymentValue
              console.log(this.filteredData);
            }
            this.paidAmount = result?.data[0]?.payment?.["Payment 1"]?.paid_amt;
            this.roundAdj = result?.data[0]?.payment?.["Payment 1"]?.round_adj;
            this.visaData = Object.values(
              result?.data[0]?.payment?.["VISA"] || {}
            );

            this.visaDataSubtotal = result?.data[0]?.payment?.["VISA"];
            this.masterData = Object.values(
              result?.data[0]?.payment?.["MASTER"] || {}
            );

            this.masterDataSubtotal = result?.data[0]?.payment?.["MASTER"];
            this.subTotalSC01 = result?.data[0];
            this.grandTotalData = result;
            this.calculateTotalPages();
            this.filteredData.splice(-4);
            this.visaData.splice(-4);
            this.masterData.splice(-4);
          }
          this.loadingSpinner = false;
        }, 1000);
      });
  }

  calculateTotalPages() {
    setTimeout(() => {
      if (this.filteredData && this.itemsPerPage) {
        this.totalPages = Math.ceil(
          this.filteredData.length / this.itemsPerPage
        );
      }
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
