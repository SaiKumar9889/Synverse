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

  storeIdValue: string = "";
  selectedStoreId: any;
  stores: any[] = [
    { value: "%5B%22SC01%22%5D", viewValue: "Project Store" },
    { value: "%5B%22SC02%22%5D", viewValue: "Project Store 2" },
  ];
  onSelectionChange(event: any): void {
    this.storeIdValue = event.value;
    console.log("Selection change event:", event.value);
  }

  selectedTerminalId: any;
  terminalIdValue: string = "";
  terminalId: any[] = [{ value: "%5B%22T1%22%5D", viewValue: "Terminal 1" }];
  onTerminalChange(event: any): void {
    this.terminalIdValue = event.value;
    console.log("Selection change event:", event.value);
  }

  selectedGroupId: any;
  groupIdValue: string = "";
  groupId: any[] = [
    { value: "%5B%22GC01%22%5D", viewValue: "MAIN FOOD" },
    { value: "%5B%22GC02%22%5D", viewValue: "FRIED FOOD" },
    { value: "%5B%22GC03%22%5D", viewValue: "NOODLES" },
    { value: "%5B%22GC04%22%5D", viewValue: "WESTERN" },
    { value: "%5B%22GC05%22%5D", viewValue: "DESSERT" },
    { value: "%5B%22GC06%22%5D", viewValue: "DRINK" },
  ];
  onGroupChange(event: any): void {
    this.groupIdValue = event.value;
    console.log("Selection change event:", event.value);
  }

  selectedDepartmentId: any;
  departmentIdValue: string = "";
  departmentId: any[] = [
    { value: "%5B%22DC01%22%5D", viewValue: "MAIN FOOD" },
    { value: "%5B%22DC02%22%5D", viewValue: "FRIED FOOD" },
    { value: "%5B%22DC03%22%5D", viewValue: "NOODLES" },
    { value: "%5B%22DC04%22%5D", viewValue: "WESTERN" },
    { value: "%5B%22DC05%22%5D", viewValue: "DESSERT" },
    { value: "%5B%22DC06%22%5D", viewValue: "DRINK" },
  ];

  onDepartmentChange(event: any): void {
    this.departmentIdValue = event.value;
    console.log("Selection change event:", event.value);
  }

  selectedCategoryId: any;
  categoryIdValue: string = "";
  categoryId: any[] = [
    { value: "%5B%22CC01%22%5D", viewValue: "FOOD" },
    { value: "%5B%22CC02%22%5D", viewValue: "DRINK" },
  ];

  onCategoryChange(event: any): void {
    this.categoryIdValue = event.value;
    console.log("Selection change event:", event.value);
  }

  selectedStockId: any;
  stockIdValue: string = "";
  stockId: any[] = [
    { value: "%5B%22SC01%22%5D", viewValue: "NASI AYAM" },
    { value: "%5B%22SC02%22%5D", viewValue: "NASI GORENG AYAM" },
    { value: "%5B%22SC03%22%5D", viewValue: "MEE CURRY" },
    { value: "%5B%22SC04%22%5D", viewValue: "CHICKEN CHOP" },
    { value: "%5B%22SC05%22%5D", viewValue: "ICE CREAM SCOOP" },
    { value: "%5B%22SC07%22%5D", viewValue: "CHOCOLATE AIS" },
    { value: "%5B%22SC10%22%5D", viewValue: "Single Set Menu" },
    { value: "%5B%22SC11%22%5D", viewValue: "Enter Set Menu" },
    { value: "%5B%22SC12%22%5D", viewValue: "All Set Menu" },
  ];
  onStockChange(event: any): void {
    this.stockIdValue = event.value;
    console.log("Selection change event:", event.value);
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

  salesRemark() {
    console.log(this.searchFrom);
    console.log(this.searchTo);
    this.appService
      .soldItemAnalysis(
        this.searchFrom,
        this.searchTo,
        this.storeIdValue,
        this.terminalIdValue,
        this.groupIdValue,
        this.departmentIdValue,
        this.categoryIdValue,
        this.stockIdValue,
        this.isCheckbox,
        this.isCheckboxShift,
        this.isCheckboxChanged,
        this.isCheckboxDiscount,
        this.isCheckboxTransaction,
        this.isCheckboxCombine,
        this.isCheckboxNormal
      )
      .subscribe((result) => {
        if (result || result == null || result == undefined) {
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
        }
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
