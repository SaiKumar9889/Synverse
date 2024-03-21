import { Component, OnDestroy, OnInit } from "@angular/core";
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
export class PaymentTypeComponent implements OnInit, OnDestroy {
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
        this.paymentType("", "");
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
  }

  selectedToDate() {
    this.searchTo = this.datePipe.transform(this.dateTo.value, "yyyy-MM-dd");
  }
  applyDateFilter() {
    this.itemsPerPage = 5;
    if (this.selectedDate === "custom") {
      this.paymentType(this.searchFrom, this.searchTo);
    } else {
      this.paymentType("", "");
    }
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
      this.isCheckbox = "true";
    } else {
      this.isCheckbox = "false";
    }
  }
  shiftCheckboxState(): void {
    if (this.isCheckedShift) {
      this.isCheckboxShift = "true";
    } else {
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
  PaymentTypeCode: any;
  paymentArray: any;
  visaArray: any;
  masterArray: any;
  cashArray: any;
  duitArray: any;
  grabArray: any;
  shopeeArray: any;
  walletArray: any;
  subTotalCash: any;
  subTotalDuit: any;
  subTotalGrab: any;
  subTotalShopee: any;
  subTotalWallet: any;
  subTotalPayment: any;

  paymentType(fromDate: any, toDate: any) {
    this.loadingSpinner = true;
    this.errorMessage = null;
    this.PaymentTypeCode = this.appService
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
        this.isCheckboxShift,
        this.dateValue
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
            let array: any = [];
            if (result.data !== "failed") {
              result.data.forEach((element: any) => {
                array.push({
                  store_code: element.store_code,
                  store_name: element.store_name,
                });
                // element.splice(-4);
                this.paymentArray = Object.values(
                  element.payment["Payment 1"] || {}
                );
                this.paymentArray.splice(-4);
                this.paymentArray.forEach((element1: any) => {
                  array.push({
                    terminal: element1.PYMT_MASTCODE,
                    payment: element1.PYMT_PAYBYCODEDESC,
                    date: element1.PYMT_CLOSEDATE,
                    price_level: element1.PYMT_SALES_PRICELVL,
                    shift: element1.PYMT_STATUS,
                    net_sales: element1.PYMT_PAYAMT,
                    rounding_adjust: element1.PYMT_ROUND_ADJ,
                  });

                  // element1?.splice(-4);
                });
                this.cashArray = Object.values(element.payment["CASH"] || {});
                this.cashArray.splice(-4);

                this.cashArray.forEach((element2: any) => {
                  array.push({
                    terminal: element2.PYMT_MASTCODE,
                    payment: element2.PYMT_PAYBYCODEDESC,
                    date: element2.PYMT_CLOSEDATE,
                    price_level: element2.PYMT_SALES_PRICELVL,
                    shift: element2.PYMT_STATUS,
                    net_sales: element2.PYMT_PAYAMT,
                    rounding_adjust: element2.PYMT_ROUND_ADJ,
                  });

                  // element3?.splice(-4);
                });
                this.duitArray = Object.values(
                  element.payment["DUIT NOW"] || {}
                );
                this.duitArray.splice(-4);

                this.duitArray.forEach((element3: any) => {
                  array.push({
                    terminal: element3.PYMT_MASTCODE,
                    payment: element3.PYMT_PAYBYCODEDESC,
                    date: element3.PYMT_CLOSEDATE,
                    price_level: element3.PYMT_SALES_PRICELVL,
                    shift: element3.PYMT_STATUS,
                    net_sales: element3.PYMT_PAYAMT,
                    rounding_adjust: element3.PYMT_ROUND_ADJ,
                  });

                  // element3?.splice(-4);
                });

                this.grabArray = Object.values(element.payment["GRAB"] || {});
                this.grabArray.splice(-4);

                this.grabArray.forEach((element4: any) => {
                  array.push({
                    terminal: element4.PYMT_MASTCODE,
                    payment: element4.PYMT_PAYBYCODEDESC,
                    date: element4.PYMT_CLOSEDATE,
                    price_level: element4.PYMT_SALES_PRICELVL,
                    shift: element4.PYMT_STATUS,
                    net_sales: element4.PYMT_PAYAMT,
                    rounding_adjust: element4.PYMT_ROUND_ADJ,
                  });

                  // element3?.splice(-4);
                });

                this.visaArray = Object.values(element.payment["VISA"] || {});
                this.visaArray.splice(-4);

                this.visaArray.forEach((element5: any) => {
                  array.push({
                    terminal: element5.PYMT_MASTCODE,
                    payment: element5.PYMT_PAYBYCODEDESC,
                    date: element5.PYMT_CLOSEDATE,
                    price_level: element5.PYMT_SALES_PRICELVL,
                    shift: element5.PYMT_STATUS,
                    net_sales: element5.PYMT_PAYAMT,
                    rounding_adjust: element5.PYMT_ROUND_ADJ,
                  });

                  // element2?.splice(-4);
                });

                this.shopeeArray = Object.values(
                  element.payment["SHOPEE FOOD"] || {}
                );
                this.shopeeArray.splice(-4);

                this.shopeeArray.forEach((element6: any) => {
                  array.push({
                    terminal: element6.PYMT_MASTCODE,
                    payment: element6.PYMT_PAYBYCODEDESC,
                    date: element6.PYMT_CLOSEDATE,
                    price_level: element6.PYMT_SALES_PRICELVL,
                    shift: element6.PYMT_STATUS,
                    net_sales: element6.PYMT_PAYAMT,
                    rounding_adjust: element6.PYMT_ROUND_ADJ,
                  });

                  // element2?.splice(-4);
                });

                this.walletArray = Object.values(
                  element.payment["TNG E-WALLET"] || {}
                );
                this.walletArray.splice(-4);

                this.walletArray.forEach((element7: any) => {
                  array.push({
                    terminal: element7.PYMT_MASTCODE,
                    payment: element7.PYMT_PAYBYCODEDESC,
                    date: element7.PYMT_CLOSEDATE,
                    price_level: element7.PYMT_SALES_PRICELVL,
                    shift: element7.PYMT_STATUS,
                    net_sales: element7.PYMT_PAYAMT,
                    rounding_adjust: element7.PYMT_ROUND_ADJ,
                  });

                  // element2?.splice(-4);
                });

                this.masterArray = Object.values(
                  element.payment["MASTER"] || {}
                );
                this.masterArray.splice(-4);

                this.masterArray.forEach((element8: any) => {
                  array.push({
                    terminal: element8.PYMT_MASTCODE,
                    payment: element8.PYMT_PAYBYCODEDESC,
                    date: element8.PYMT_CLOSEDATE,
                    price_level: element8.PYMT_SALES_PRICELVL,
                    shift: element8.PYMT_STATUS,
                    net_sales: element8.PYMT_PAYAMT,
                    rounding_adjust: element8.PYMT_ROUND_ADJ,
                  });

                  // element3?.splice(-4);
                });
              });
              console.log(array);
            }
            this.filteredData = array;
            if (this.filteredData !== undefined) {
              // Your code to handle the non-undefined paymentValue
            }
            this.subTotalPayment = result?.data;
            // this.roundAdj = result?.data[0]?.payment?.["Payment 1"]?.round_adj;
            this.subTotalCash = result?.data[0]?.payment?.["CASH"];
            this.subTotalDuit = result?.data[0]?.payment?.["DUIT NOW"];
            this.subTotalGrab = result?.data[0]?.payment?.["GRAB"];
            this.subTotalShopee = result?.data[0]?.payment?.["SHOPEE FOOD"];
            this.subTotalWallet = result?.data[0]?.payment?.["TNG E-WALLET"];

            // this.visaData = Object.values(
            //   result?.data[0]?.payment?.["VISA"] || {}
            // );

            this.visaDataSubtotal = result?.data;
            // this.masterData = Object.values(
            //   result?.data[0]?.payment?.["MASTER"] || {}
            // );

            this.masterDataSubtotal = result?.data;
            this.subTotalSC01 = result?.data;
            this.grandTotalData = result;
            this.calculateTotalPages();
            // this.filteredData.splice(-4);
            // this.visaData.splice(-4);
            // this.masterData.splice(-4);
          }
          this.loadingSpinner = false;
        }, 100);
      });
  }
  ngOnDestroy(): void {
    this.PaymentTypeCode.unsubscribe();
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
