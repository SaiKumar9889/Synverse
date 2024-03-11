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
  selector: "app-vendor-voucher",
  templateUrl: "./vendor-voucher.component.html",
  styleUrls: ["./vendor-voucher.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class VendorVoucherComponent {
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
  firstDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    new Date().getDate()
  );
  secondDate = new Date();
  fromDate: any;
  toDate: any;
  loadingSpinner: boolean;

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
        this.vendorVoucher(this.fromDate, this.toDate);
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
    this.vendorVoucher(this.searchFrom, this.searchTo);
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

  selectedGroupId: any;
  groupIdValue: string[] = [];
  groupId: any[] = [
    { value: "GC01", viewValue: "MAIN FOOD" },
    { value: "GC02", viewValue: "FRIED FOOD" },
    { value: "GC03", viewValue: "NOODLES" },
    { value: "GC04", viewValue: "WESTERN" },
    { value: "GC05", viewValue: "DESSERT" },
    { value: "GC06", viewValue: "DRINK" },
  ];
  onGroupChange(event: any): void {
    setTimeout(() => {
      if (this.selectedGroupItems.includes("all")) {
        this.groupIdValue = this.groupId.map((item) => item.value);
      } else {
        this.groupIdValue = event.value;
      }
    }, 500);
  }
  selectedGroupItems: string[] = [];

  selectGroupAll() {
    if (this.selectedGroupItems.includes("all")) {
      this.selectedGroupItems = this.groupId.map((item) => item.value);
      this.selectedGroupItems.push("all");
    } else {
      this.selectedGroupItems.length = 0;
      this.selectedGroupItems = [];
    }
  }

  selectedDepartmentId: any;
  departmentIdValue: string[] = [];
  departmentId: any[] = [
    { value: "DC01", viewValue: "MAIN FOOD" },
    { value: "DC02", viewValue: "FRIED FOOD" },
    { value: "DC03", viewValue: "NOODLES" },
    { value: "DC04", viewValue: "WESTERN" },
    { value: "DC05", viewValue: "DESSERT" },
    { value: "DC06", viewValue: "DRINK" },
  ];
  onDepartmentChange(event: any): void {
    setTimeout(() => {
      if (this.selectedDepartmentItems.includes("all")) {
        this.departmentIdValue = this.departmentId.map((item) => item.value);
      } else {
        this.departmentIdValue = event.value;
      }
    }, 500);
  }
  selectedDepartmentItems: string[] = [];

  selectDepartmentAll() {
    if (this.selectedDepartmentItems.includes("all")) {
      this.selectedDepartmentItems = this.departmentId.map(
        (item) => item.value
      );
      this.selectedDepartmentItems.push("all");
    } else {
      this.selectedDepartmentItems.length = 0;
      this.selectedDepartmentItems = [];
    }
  }

  selectedCategoryId: any;
  categoryIdValue: string[] = [];
  categoryId: any[] = [
    { value: "CC01", viewValue: "FOOD" },
    { value: "CC02", viewValue: "DRINK" },
  ];
  onCategoryChange(event: any): void {
    setTimeout(() => {
      if (this.selectedCategoryItems.includes("all")) {
        this.categoryIdValue = this.categoryId.map((item) => item.value);
      } else {
        this.categoryIdValue = event.value;
      }
    }, 500);
  }
  selectedCategoryItems: string[] = [];

  selectCategoryAll() {
    if (this.selectedCategoryItems.includes("all")) {
      this.selectedCategoryItems = this.categoryId.map((item) => item.value);
      this.selectedCategoryItems.push("all");
    } else {
      this.selectedCategoryItems.length = 0;
      this.selectedCategoryItems = [];
    }
  }

  selectedStockId: any;
  stockIdValue: string[] = [];
  stockId: any[] = [
    { value: "SC01", viewValue: "NASI AYAM" },
    { value: "SC02", viewValue: "NASI GORENG AYAM" },
    { value: "SC03", viewValue: "MEE CURRY" },
    { value: "SC04", viewValue: "CHICKEN CHOP" },
    { value: "SC05", viewValue: "ICE CREAM SCOOP" },
    { value: "SC07", viewValue: "CHOCOLATE AIS" },
    { value: "SC10", viewValue: "Single Set Menu" },
    { value: "SC11", viewValue: "Enter Set Menu" },
    { value: "SC12", viewValue: "All Set Menu" },
  ];
  onStockChange(event: any): void {
    setTimeout(() => {
      if (this.selectedStockItems.includes("all")) {
        this.stockIdValue = this.stockId.map((item) => item.value);
      } else {
        this.stockIdValue = event.value;
      }
    }, 500);
  }
  selectedStockItems: string[] = [];

  selectStockAll() {
    if (this.selectedStockItems.includes("all")) {
      this.selectedStockItems = this.stockId.map((item) => item.value);
      this.selectedStockItems.push("all");
    } else {
      this.selectedStockItems.length = 0;
      this.selectedStockItems = [];
    }
  }

  selectedShiftId: any;
  shiftValue: string[] = [];
  shiftId: any[] = [
    { value: "SC01", viewValue: "Morning Shift" },
    { value: "SC02", viewValue: "Evening Shift" },
  ];
  onShiftChange(event: any): void {
    setTimeout(() => {
      if (this.selectedShiftItems.includes("all")) {
        this.shiftValue = this.shiftId.map((item) => item.value);
      } else {
        this.shiftValue = event.value;
      }
    }, 500);
  }
  selectedShiftItems: string[] = [];

  selectShiftAll() {
    if (this.selectedShiftItems.includes("all")) {
      this.selectedShiftItems = this.shiftId.map((item) => item.value);
      this.selectedShiftItems.push("all");
    } else {
      this.selectedShiftItems.length = 0;
      this.selectedShiftItems = [];
    }
  }

  operatorValue: string[] = [];
  selectedOperator: any;
  operators: any[] = [{ value: "SYNV", viewValue: "SYNV" }];
  onOperatorChange(event: any): void {
    setTimeout(() => {
      if (this.selectedOperatorItems.includes("all")) {
        this.operatorValue = this.operators.map((item) => item.value);
      } else {
        this.operatorValue = event.value;
      }
    }, 500);
  }
  selectedOperatorItems: string[] = [];

  selectOperatorAll() {
    if (this.selectedOperatorItems.includes("all")) {
      this.selectedOperatorItems = this.operators.map((item) => item.value);
      this.selectedOperatorItems.push("all");
    } else {
      this.selectedOperatorItems.length = 0;
      this.selectedOperatorItems = [];
    }
  }
  errorMessage: any = null;
  vendorVoucher(fromDate: any, toDate: any) {
    this.loadingSpinner = true;
    this.appService
      .vendorVoucher(
        "json",
        fromDate,
        toDate,
        this.storeIdValue && this.storeIdValue.length
          ? JSON.stringify(this.storeIdValue)
          : "",
        this.terminalIdValue && this.terminalIdValue.length
          ? JSON.stringify(this.terminalIdValue)
          : "",
        this.groupIdValue && this.groupIdValue.length
          ? JSON.stringify(this.groupIdValue)
          : "",
        this.departmentIdValue && this.departmentIdValue.length
          ? JSON.stringify(this.departmentIdValue)
          : "",
        this.shiftValue && this.shiftValue.length
          ? JSON.stringify(this.shiftValue)
          : "",
        this.operatorValue && this.operatorValue.length
          ? JSON.stringify(this.operatorValue)
          : "",
        this.categoryIdValue && this.categoryIdValue.length
          ? JSON.stringify(this.categoryIdValue)
          : "",
        this.stockIdValue && this.stockIdValue.length
          ? JSON.stringify(this.stockIdValue)
          : ""
      )
      .subscribe(async (result) => {
        console.log(result);

        setTimeout(() => {
          if (result && result.data == "") {
            console.log(result.message);
            this.errorMessage = "Data not found";
            console.log(this.errorMessage);
          } else {
            this.errorMessage = null;
          }
          this.loadingSpinner = false;
        }, 1000);
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
