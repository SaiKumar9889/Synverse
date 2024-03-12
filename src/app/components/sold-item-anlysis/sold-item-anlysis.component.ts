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
    this.authService.login().subscribe((result) => {
      console.log(result);
      if (result && result.access_token) {
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.salesRemark(this.fromDate, this.toDate);
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
    this.salesRemark(this.searchFrom, this.searchTo);
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
    const storedState = localStorage.getItem("checkboxChange");
    this.isChecked = storedState ? JSON.parse(storedState) : false;

    const shiftState = localStorage.getItem("checkboxState");
    this.isCheckedShift = shiftState ? JSON.parse(shiftState) : false;

    const changedState = localStorage.getItem("checkboxShift");
    this.isCheckedChange = changedState ? JSON.parse(changedState) : false;
    this.logCheckboxState();
    this.shiftCheckboxState();
    this.logCheckboxChanged();

    const discountState = localStorage.getItem("checkedDiscountState");
    this.isCheckedDiscount = discountState ? JSON.parse(discountState) : false;
    this.logCheckboxDiscount();
    const transactionState = localStorage.getItem("checkedDiscountState");
    this.isCheckedTransaction = transactionState
      ? JSON.parse(transactionState)
      : false;

    this.logCheckboxTransaction();
    const combineState = localStorage.getItem("checkedCombineState");
    this.isCheckedCombine = combineState ? JSON.parse(combineState) : false;

    this.logCheckboxCombine();
    const normalState = localStorage.getItem("checkedNormalState");
    this.isCheckedNormal = normalState ? JSON.parse(normalState) : false;
    this.logCheckboxNormal();
  }

  onDiscountChange(event: any): void {
    this.isCheckedDiscount = event.checked;
    localStorage.setItem(
      "checkedDiscountState",
      JSON.stringify(this.isCheckedDiscount)
    );
    this.logCheckboxDiscount();
  }

  logCheckboxDiscount(): void {
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

    localStorage.setItem("checkboxChange", JSON.stringify(this.isChecked));
    this.logCheckboxState();
  }

  isChanged: string;
  isCheckboxChanged: string = "F";
  onCheckboxChanged(event: any): void {
    this.isCheckedChange = event.checked;
    localStorage.setItem("checkboxState", JSON.stringify(this.isCheckedChange));
    this.logCheckboxChanged();
  }

  onShiftChange(event: any): void {
    this.isCheckedShift = event.checked;

    localStorage.setItem("checkboxShift", JSON.stringify(this.isCheckedShift));
    this.shiftCheckboxState();
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
  logCheckboxChanged(): void {
    if (this.isCheckedChange) {
      console.log("true");
      this.isCheckboxChanged = "T";
    } else {
      console.log("false");
      this.isCheckboxChanged = "F";
    }
  }
  shiftCheckboxState(): void {
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

    localStorage.setItem(
      "checkedTransactionState",
      JSON.stringify(this.isCheckedTransaction)
    );
    this.logCheckboxTransaction();
  }

  logCheckboxTransaction(): void {
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
    localStorage.setItem(
      "checkedCombineState",
      JSON.stringify(this.isCheckedCombine)
    );
    this.logCheckboxCombine();
  }

  logCheckboxCombine(): void {
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
    localStorage.setItem(
      "checkedNormalState",
      JSON.stringify(this.isCheckedNormal)
    );
    this.logCheckboxNormal();
  }

  logCheckboxNormal(): void {
    if (this.isCheckedNormal) {
      console.log("true");
      this.isCheckboxNormal = "T";
    } else {
      console.log("false");
      this.isCheckboxNormal = "F";
    }
  }
  errorMessage: any = null;
  salesRemark(fromDate: any, toDate: any) {
    this.loadingSpinner = true;
    console.log(this.searchFrom);
    console.log(this.searchTo);
    this.appService
      .soldItemAnalysis(
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
          this.errorMessage = "No Data Found";
          console.log(this.errorMessage);
        } else {
          this.errorMessage = null;
        }
        if (result) {
        }
        setTimeout(() => {
          if (result) {
            this.store_code = result?.data[0]?.store_code;
            this.store_name = result?.data[0]?.store_desc;
            this.terminal_code = result?.data[1]?.sold_item[0];
            this.filteredData = Object.values(
              result?.data[1]?.sold_item[0]?.data || {}
            );
            console.log(this.terminal_code);
            this.storesFilterData = Object.values(result?.data || {});
            this.subTotalTerminal = result?.data[1]?.sold_item[0];
            this.subTotalData = result?.data[1];
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
