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
  loadingSpinner: boolean = true;
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
    this.authService.login().subscribe((result) => {
      if (result && result.access_token) {
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
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.averageSalesSummary(this.fromDate, this.toDate);
        this.getStore();
        // this.calculateTotalPages();
      }
    });
    this.selectedFormDate();
    this.selectedToDate();
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

  salesValue: string = "total";
  selectedSales: any;
  sales: any[] = [
    { value: "gross", viewValue: "Gross Sales" },
    { value: "net", viewValue: "Net Sales" },
    { value: "total", viewValue: "Total Sales" },
  ];
  onSalesChange(event: any): void {
    this.salesValue = event.value;
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
    this.averageSalesSummary(this.searchFrom, this.searchTo);
  }

  filteredData: any[] = [];
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
  isChecked: boolean;

  ngOnInit(): void {
    const storedState = localStorage.getItem("checkboxState");
    this.loadingSpinner = true;
    this.isChecked = storedState ? JSON.parse(storedState) : false;
    this.logCheckboxState();
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
  errorMessage: any = null;
  averageSalesSummary(fromDate: any, toDate: any) {
    this.loadingSpinner = true;
    this.appService
      .averageSalesSummary(
        "json",
        fromDate,
        toDate,
        this.storeIdValue && this.storeIdValue.length
          ? JSON.stringify(this.storeIdValue)
          : "",
        this.salesValue,
        this.isCheckbox
      )
      .subscribe((result) => {
        if (result && result.data == "") {
          console.log(result.message);
          this.errorMessage = "No Data Found";
          console.log(this.errorMessage);
          // }
        } else {
          this.errorMessage = null;
        }
        setTimeout(() => {
          if (result) {
            this.store_code = result?.data[0]?.store_code;
            this.store_name = result?.data[0]?.store_desc;
            this.filteredData = result?.data[0]?.average_sales;
            this.storesFilterData = result?.data[0]?.average_sales;
            this.subTotalData = result?.data[0];
            this.grandTotalData = result;
            this.filteredData = this.storesFilterData;
            this.loadingSpinner = false;
            console.log(this.filteredData);
            this.calculateTotalPages();
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
