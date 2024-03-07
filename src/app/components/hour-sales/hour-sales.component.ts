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
  selector: "app-hour-sales",
  templateUrl: "./hour-sales.component.html",
  styleUrls: ["./hour-sales.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class HourSalesComponent {
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
  itemsPerPageOptions = [5, 10, 15, 20];

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
      console.log(result);
      if (result && result.access_token) {
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.hourlySales(this.fromDate, this.toDate);
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
    this.loadingSpinner = true;
    this.hourlySales(this.searchFrom, this.searchTo);
  }

  filteredData: any;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const filteredDataValue = filterValue.trim().toLowerCase();
    this.filteredData = this.storesFilterData.filter(
      (item: any) =>
        item.hourly_range.toString().includes(filteredDataValue) ||
        item.total_rcptno.toString().includes(filteredDataValue) ||
        item.total_gross.toString().includes(filteredDataValue) ||
        item.total_disc.toString().includes(filteredDataValue) ||
        item.total_netsales.toString().includes(filteredDataValue) ||
        item.total.toString().includes(filteredDataValue) ||
        item.contribution.toString().includes(filteredDataValue)
    );
    console.log(this.filteredData);
  }

  selectedGroupingId: any;
  groupingIdValue: string = "store";
  groupingId: any[] = [
    { value: "store", viewValue: "Store" },
    { value: "store_terminal", viewValue: "Store Terminal" },
  ];
  onGroupingChange(event: any): void {
    this.groupingIdValue = event.value;
    console.log("Selection change event:", event.value);
  }
  errorMessage = null;
  hourlySales(fromDate: any, toDate: any) {
    this.errorMessage = null;
    console.log(this.searchFrom);
    console.log(this.searchTo);
    this.appService
      .hourlySales("json", fromDate, toDate, this.groupingIdValue)
      .subscribe((result) => {
        if (result && result.success == false) {
          console.log(result.message);
          this.errorMessage = result.message;
          console.log(this.errorMessage);
        }

        setTimeout(() => {
          if (result) {
            this.store_code = result?.data[0]?.store_code;
            this.store_name = result?.data[0]?.store_name;
            this.filteredData = result?.data[0]?.hourly_sales;
            this.storesFilterData = result?.data[0]?.hourly_sales;
            this.subTotalData = result?.data[0];
            this.grandTotalData = result;
            this.filteredData = this.storesFilterData;
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

    console.log(this.totalPages);
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
