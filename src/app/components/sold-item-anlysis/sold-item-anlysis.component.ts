import { Component } from "@angular/core";
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
  selector: "app-sold-item-anlysis",
  templateUrl: "./sold-item-anlysis.component.html",
  styleUrls: ["./sold-item-anlysis.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SoldItemAnlysisComponent {
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
  terminal_code: any;
  terminal_name: any;
  subTotalTerminal: any;
  itemsPerPage = 5;
  currentPage = 1;
  totalPages: number;
  pagesToShow = 5;
  Math: any;
  itemsPerPageOptions = [5, 10, 15, 20, 50, 100];

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
      "yyyy-MM-dd"
    );
    console.log(this.searchFrom);
  }
  selectedToDate(date: any) {
    this.searchTo = this.datePipe.transform(this.dateTo.value, "yyyy-MM-dd");
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
        item.detail.SDTL_SALES_RCPTNO.toString().includes(filteredDataValue) ||
        item.detail.SDTL_STOCK_CODE.toLowerCase().includes(filteredDataValue) ||
        item.detail.SDTL_SHORTDESC.toLowerCase().includes(filteredDataValue) ||
        item.detail.SDTL_SALES_PRICELVL.toLowerCase().includes(
          filteredDataValue
        ) ||
        item.detail.SDTL_SALES_PRICE_SHIFT.toLowerCase().includes(
          filteredDataValue
        ) ||
        item.detail.SDTL_STATUS.toLowerCase().includes(filteredDataValue) ||
        item.detail.SDTL_QTY.toString().includes(filteredDataValue) ||
        item.detail.SDTL_GROSS.toString().includes(filteredDataValue) ||
        item.detail.SDTL_DISCAMT.toString().includes(filteredDataValue) ||
        item.detail.SDTL_NETT.toString().includes(filteredDataValue) ||
        item.detail.SDTL_CHANGEPRC.toString().includes(filteredDataValue)
    );
    console.log(this.filteredData);
  }

  storeIdValue: string[] = [];
  selectedStoreId: any;
  stores: any[] = [
    { value: "SC01", viewValue: "Project Store" },
    { value: "SC02", viewValue: "Project Store 2" },
  ];
  onSelectionChange(event: any): void {
    setTimeout(() => {
      if (this.selectedItems.includes("all")) {
        this.storeIdValue = this.stores.map((item) => item.value);
        // this.storeIdValue = "%5B%22SC01%22,%22SC02%22%5D";
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
        // this.groupIdValue =
        //   "%5B%22GC01%22,%22GC02%22,%22GC03%22,%22GC04%22,%22GC05%22,%22GC06%22%5D";
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
        // this.departmentIdValue =
        //   "%5B%22DC01%22,%22DC02%22,%22DC03%22,%22DC04%22,%22DC05%22,%22DC06%22%5D";
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
        // this.categoryIdValue = "%5B%22CC01%22,%22CC02%22%5D";
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
        // this.stockIdValue =
        //   "%5B%22SC01%22,%22SC02%22,%22SC03%22,%22SC04%22,%22SC05%22,%22SC07%22,%22SC10%22,%22SC11%22,%22SC12%22%5D";
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

  isChecked: boolean;
  isCheckedShift: boolean;
  isCheckedChange: boolean;
  isCheckedDiscount: boolean;
  isCheckboxDiscount: string = "F";
  isCheckedTransaction: boolean;
  isCheckboxTransaction: string = "T";
  isCheckedCombine: boolean;
  isCheckboxCombine: string = "T";
  isCheckedNormal: boolean;
  isCheckboxNormal: string;
  ngOnInit(): void {
    // Retrieve the stored checkbox state from localStorage
    const storedState = localStorage.getItem("checkboxChange");

    // If a state is stored, use it; otherwise, default to false
    this.isChecked = storedState ? JSON.parse(storedState) : false;

    const shiftState = localStorage.getItem("checkboxState");

    // If a state is stored, use it; otherwise, default to false
    this.isCheckedShift = shiftState ? JSON.parse(shiftState) : false;

    const changedState = localStorage.getItem("checkboxShift");

    // If a state is stored, use it; otherwise, default to false
    this.isCheckedChange = changedState ? JSON.parse(changedState) : false;
    this.logCheckboxState();
    this.shiftCheckboxState();
    this.logCheckboxChanged();

    const discountState = localStorage.getItem("checkedDiscountState");

    // If a state is stored, use it; otherwise, default to false
    this.isCheckedDiscount = discountState ? JSON.parse(discountState) : false;

    // Print the initial checkbox state
    this.logCheckboxDiscount();
    const transactionState = localStorage.getItem("checkedDiscountState");

    // If a state is stored, use it; otherwise, default to false
    this.isCheckedTransaction = transactionState
      ? JSON.parse(transactionState)
      : false;

    // Print the initial checkbox state
    this.logCheckboxTransaction();
    const combineState = localStorage.getItem("checkedCombineState");

    // If a state is stored, use it; otherwise, default to false
    this.isCheckedCombine = combineState ? JSON.parse(combineState) : false;

    // Print the initial checkbox state
    this.logCheckboxCombine();
    const normalState = localStorage.getItem("checkedNormalState");

    // If a state is stored, use it; otherwise, default to false
    this.isCheckedNormal = normalState ? JSON.parse(normalState) : false;

    // Print the initial checkbox state
    this.logCheckboxNormal();
  }

  onDiscountChange(event: any): void {
    this.isCheckedDiscount = event.checked;

    // Store the checkbox state in localStorage
    localStorage.setItem(
      "checkedDiscountState",
      JSON.stringify(this.isCheckedDiscount)
    );

    // Print "true" or "false" based on the checkbox state
    this.logCheckboxDiscount();
  }

  logCheckboxDiscount(): void {
    // Print "true" or "false" based on the current checkbox state
    if (this.isCheckedDiscount) {
      console.log("true");
      this.isCheckboxDiscount = "T";
    } else {
      console.log("false");
      this.isCheckboxDiscount = "F";
    }
  }

  isCheckbox: string = "F";
  isCheckboxShift: string = "F";
  onCheckboxChange(event: any): void {
    this.isChecked = event.checked;

    // Store the checkbox state in localStorage
    localStorage.setItem("checkboxChange", JSON.stringify(this.isChecked));

    // Print "true" or "false" based on the checkbox state
    this.logCheckboxState();
  }

  isChanged: string;
  isCheckboxChanged: string = "F";
  onCheckboxChanged(event: any): void {
    this.isCheckedChange = event.checked;

    // Store the checkbox state in localStorage
    localStorage.setItem("checkboxState", JSON.stringify(this.isCheckedChange));

    // Print "true" or "false" based on the checkbox state
    this.logCheckboxChanged();
  }

  onShiftChange(event: any): void {
    this.isCheckedShift = event.checked;

    // Store the checkbox state in localStorage
    localStorage.setItem("checkboxShift", JSON.stringify(this.isCheckedShift));

    // Print "true" or "false" based on the checkbox state
    this.shiftCheckboxState();
  }

  logCheckboxState(): void {
    // Print "true" or "false" based on the current checkbox state
    if (this.isChecked) {
      console.log("true");
      this.isCheckbox = "T";
    } else {
      console.log("false");
      this.isCheckbox = "F";
    }
  }
  logCheckboxChanged(): void {
    // Print "true" or "false" based on the current checkbox state
    if (this.isCheckedChange) {
      console.log("true");
      this.isCheckboxChanged = "T";
    } else {
      console.log("false");
      this.isCheckboxChanged = "F";
    }
  }
  shiftCheckboxState(): void {
    // Print "true" or "false" based on the current checkbox state
    if (this.isCheckedShift) {
      console.log("true");
      this.isCheckboxShift = "T";
    } else {
      console.log("false");
      this.isCheckboxShift = "F";
    }
  }

  onTransactionChange(event: any): void {
    this.isCheckedTransaction = event.checked;

    // Store the checkbox state in localStorage
    localStorage.setItem(
      "checkedTransactionState",
      JSON.stringify(this.isCheckedTransaction)
    );

    // Print "true" or "false" based on the checkbox state
    this.logCheckboxTransaction();
  }

  logCheckboxTransaction(): void {
    // Print "true" or "false" based on the current checkbox state
    if (this.isCheckedTransaction) {
      console.log("true");
      this.isCheckboxTransaction = "T";
    } else {
      console.log("false");
      this.isCheckboxTransaction = "F";
    }
  }

  onCombineChange(event: any): void {
    this.isCheckedCombine = event.checked;

    // Store the checkbox state in localStorage
    localStorage.setItem(
      "checkedCombineState",
      JSON.stringify(this.isCheckedCombine)
    );

    // Print "true" or "false" based on the checkbox state
    this.logCheckboxCombine();
  }

  logCheckboxCombine(): void {
    // Print "true" or "false" based on the current checkbox state
    if (this.isCheckedCombine) {
      console.log("true");
      this.isCheckboxCombine = "T";
    } else {
      console.log("false");
      this.isCheckboxCombine = "F";
    }
  }

  onNormalChange(event: any): void {
    this.isCheckedNormal = event.checked;

    // Store the checkbox state in localStorage
    localStorage.setItem(
      "checkedNormalState",
      JSON.stringify(this.isCheckedNormal)
    );

    // Print "true" or "false" based on the checkbox state
    this.logCheckboxNormal();
  }

  logCheckboxNormal(): void {
    // Print "true" or "false" based on the current checkbox state
    if (this.isCheckedNormal) {
      console.log("true");
      this.isCheckboxNormal = "T";
    } else {
      console.log("false");
      this.isCheckboxNormal = "F";
    }
  }
  errorMessage: any;
  salesRemark() {
    console.log(this.searchFrom);
    console.log(this.searchTo);
    this.appService
      .soldItemAnalysis(
        this.searchFrom,
        this.searchTo,
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
        this.categoryIdValue && this.categoryIdValue.length
          ? JSON.stringify(this.categoryIdValue)
          : "",
        this.stockIdValue && this.stockIdValue.length
          ? JSON.stringify(this.stockIdValue)
          : "",
        this.isCheckbox,
        this.isCheckboxShift,
        this.isCheckboxChanged,
        this.isCheckboxDiscount,
        this.isCheckboxTransaction,
        this.isCheckboxCombine,
        this.isCheckboxNormal
      )
      .subscribe((result) => {
        if (result && result.data == "") {
          console.log(result.message);
          // if (result.data && result.data.group_key) {
          this.errorMessage = "No Data Found";
          console.log(this.errorMessage);
          // }
        }
        if (result) {
          this.store_code = result?.data[0]?.store_code;
          this.store_name = result?.data[0]?.store_desc;
          this.terminal_code = result?.data[0]?.sold_item[0]?.terminal_code;
          this.terminal_name = result?.data[0]?.sold_item[0]?.terminal_desc;
          this.filteredData = Object.values(
            result?.data[0]?.sold_item[0]?.data || {}
          );
          console.log(this.filteredData);
          this.storesFilterData = Object.values(
            result?.data[0]?.sold_item[0]?.data || {}
          );
          this.subTotalTerminal = result?.data[0]?.sold_item[0];
          this.subTotalData = result?.data[0];
          this.grandTotalData = result;
          this.filteredData = this.storesFilterData;
          this.loadingSpinner = false;
          this.calculateTotalPages();
        }
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
    // Implement your logic to navigate to the selected page
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
    // You may also want to reset currentPage or navigate to the first page when changing items per page.
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
