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
        this.itemreportbypricelevelshift("", "");
        this.getStore();
        this.getPriceLevel();
        this.getPriceShift();
        this.getStock();
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
    if (this.selectedDate === "custom") {
      this.itemreportbypricelevelshift(this.searchFrom, this.searchTo);
    } else {
      this.itemreportbypricelevelshift("", "");
    }
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
      if (this.selectedItems.includes("all")) {
        this.storeIdValue = this.stores.map((item: any) => item.M_CODE);
      } else {
        this.storeIdValue = event.value;
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

  selectedPaymentId: any;
  paymentIdValue: string[] = [];
  paymentId: any[] = [
    // { value: "P1", viewValue: "WEST MSIA" },
    // { value: "P2", viewValue: "EAST MSIA" },
    // { value: "P3", viewValue: "Price Lvl 3" },
    // { value: "P4", viewValue: "Price Lvl 4" },
    // { value: "P5", viewValue: "Price Lvl 5" },
    // { value: "P6", viewValue: "Price Lvl 6" },
    // { value: "P7", viewValue: "Price Lvl 7" },
    // { value: "P8", viewValue: "Price Lvl 8" },
    // { value: "P9", viewValue: "Price Lvl 9" },
  ];
  getPriceLevel() {
    this.appService.getPriceLevel().subscribe((result) => {
      this.paymentId = result;
      console.log(this.stores);
    });
  }
  onPaymentChange(event: any): void {
    setTimeout(() => {
      if (this.selectedPaymentItems.includes("all")) {
        this.paymentIdValue = this.paymentId.map((item) => item.M_CODE);
        // this.paymentIdValue =
        //   "P1%22,%22P2%22,%22P3%22,%22P4%22,%22P5%22,%22P6%22,%22P7%22,%22P8%22,%22P9";
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

  selectedStockId: any;
  stockIdValue: string[] = [];
  stockId: any[] = [
    // { value: "SC01", viewValue: "NASI AYAM" },
    // { value: "SC02", viewValue: "NASI GORENG AYAM" },
    // { value: "SC03", viewValue: "MEE CURRY" },
    // { value: "SC04", viewValue: "CHICKEN CHOP" },
    // { value: "SC05", viewValue: "ICE CREAM SCOOP" },
    // { value: "SC07", viewValue: "CHOCOLATE AIS" },
    // { value: "SC10", viewValue: "Single Set Menu" },
    // { value: "SC11", viewValue: "Enter Set Menu" },
    // { value: "SC12", viewValue: "All Set Menu" },
  ];
  getStock() {
    this.appService.getStock().subscribe((result) => {
      this.stockId = result;
      console.log(this.stores);
    });
  }
  onStockChange(event: any): void {
    setTimeout(() => {
      if (this.selectedStockItems.includes("all")) {
        this.stockIdValue = this.stockId.map((item) => item.M_STOCK_CODE);
      } else {
        this.stockIdValue = event.value;
      }
    }, 500);
  }
  selectedStockItems: string[] = [];

  selectStockAll() {
    if (this.selectedStockItems.includes("all")) {
      this.selectedStockItems = this.stockId.map((item) => item.M_STOCK_CODE);
      this.selectedStockItems.push("all");
    } else {
      this.selectedStockItems.length = 0;
      this.selectedStockItems = [];
    }
  }

  selectedShiftId: any;
  shiftIdValue: string[] = [];
  shiftId: any[] = [
    // { value: "S1", viewValue: "NORMAL" },
    // { value: "S2", viewValue: "MEMBER" },
    // { value: "S3", viewValue: "DEALER" },
    // { value: "S4", viewValue: "Price shift 4" },
    // { value: "S5", viewValue: "Price shift 5" },
    // { value: "S6", viewValue: "Price shift 6" },
    // { value: "S7", viewValue: "Price shift 7" },
    // { value: "S8", viewValue: "Price shift 8" },
    // { value: "S9", viewValue: "Price shift 9" },
  ];

  getPriceShift() {
    this.appService.getPriceShift().subscribe((result) => {
      this.shiftId = result;
      console.log(this.stores);
    });
  }

  onShiftChange(event: any): void {
    setTimeout(() => {
      if (this.selectedShiftItems.includes("all")) {
        this.shiftIdValue = this.shiftId.map((item) => item.M_CODE);
      } else {
        this.shiftIdValue = event.value;
      }
    }, 500);
  }
  selectedShiftItems: string[] = [];

  selectShiftAll() {
    if (this.selectedShiftItems.includes("all")) {
      this.selectedShiftItems = this.shiftId.map((item) => item.M_CODE);
      this.selectedShiftItems.push("all");
    } else {
      this.selectedShiftItems.length = 0;
      this.selectedShiftItems = [];
    }
  }

  dateValue: string[] = ["lyear"];
  selectedDate: any;
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
  itemreportbypricelevelshift(fromDate: any, toDate: any) {
    this.loadingSpinner = true;
    this.appService
      .itemreportbypricelevelshift(
        "json",
        fromDate,
        toDate,
        this.storeIdValue && this.storeIdValue.length
          ? JSON.stringify(this.storeIdValue)
          : "",
        this.paymentIdValue && this.paymentIdValue.length
          ? JSON.stringify(this.paymentIdValue)
          : "",
        this.stockIdValue && this.stockIdValue.length
          ? JSON.stringify(this.stockIdValue)
          : "",
        this.shiftIdValue && this.shiftIdValue.length
          ? JSON.stringify(this.shiftIdValue)
          : "",
        this.dateValue
      )
      .subscribe((result: any) => {
        if (result && result.data == "") {
          console.log(result.message);
          this.errorMessage = "No Data Found";
          console.log(this.errorMessage);
        } else if (result && result.message == "Validation Error.") {
          this.errorMessage = "stock_code does not exist.";
          console.log(this.errorMessage);
        } else {
          this.errorMessage = null;
        }

        setTimeout(() => {
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
