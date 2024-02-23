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
  selector: "app-operator-collection",
  templateUrl: "./operator-collection.component.html",
  styleUrls: ["./operator-collection.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class OperatorCollectionComponent {
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

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private datePipe: DatePipe
  ) {
    this.authService.login().subscribe((result) => {
      if (result && result.access_token) {
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.operatorCollection();
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
      "yyyy/MM/dd"
    );
    console.log(this.searchFrom);
  }
  selectedToDate(date: any) {
    this.searchTo = this.datePipe.transform(this.dateTo.value, "yyyy/MM/dd");
  }
  applyDateFilter() {
    this.operatorCollection();
  }

  filteredData: any;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const filteredDataValue = filterValue.trim().toLowerCase();
    this.filteredData = this.storesFilterData.filter(
      (item: any) =>
        item.SALES_STORE.toLowerCase().includes(filteredDataValue) ||
        item.SALES_OPERID.toString().includes(filteredDataValue) ||
        item.SALES_QTY_NS.toString().includes(filteredDataValue) ||
        item.SALES_NETSALES_NS.toString().includes(filteredDataValue) ||
        item.SALES_QTY_TV.toString().includes(filteredDataValue) ||
        item.SALES_NETSALES_TV.toString().includes(filteredDataValue) ||
        item.TOTAL_SALES_QTY_NS.toString().includes(filteredDataValue) ||
        item.TOTAL_SALES_NETSALES_NS.toString().includes(filteredDataValue)
    );
  }

  storeIdValue: string = "";
  selectedStoreId: any;
  stores: any[] = [
    { value: "%5B%22SC01%22%5D", viewValue: "Project Store" },
    { value: "%5B%22SC02%22%5D", viewValue: "Project Store 2" },
  ];
  onSelectionChange(event: any): void {
    setTimeout(() => {
      if (this.selectedItems.includes("all")) {
        // this.storeIdValue = this.stores.map((item) => item.value).join();
        this.storeIdValue = "%5B%22SC01%22,%22SC02%22%5D";
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

  operatorValue: string = "";
  selectedOperator: any;
  operators: any[] = [{ value: "%5B%22SYNV%22%5D", viewValue: "SYNV" }];
  onOperatorChange(event: any): void {
    setTimeout(() => {
      if (this.selectedOperatorItems.includes("all")) {
        this.operatorValue = this.operators.map((item) => item.value).join();
        // this.operatorValue = '"%5B%22SYNV%22%5D';
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
  errorMessage: any;
  operatorCollection() {
    this.appService
      .operatorCollection(
        "json",
        this.searchFrom,
        this.searchTo,
        this.storeIdValue,
        this.operatorValue
      )
      .subscribe((result) => {
        if (result && result.data == "") {
          console.log(result.message);
          // if (result.data && result.data.group_key) {
          this.errorMessage = "No Data Found";
          console.log(this.errorMessage);
          // }
        }
        this.store_code = result.data.store_code;
        // this.store_name = result.data[0].store_name;
        if (result) {
          this.storeData = result?.data[0]?.collection["5162"]?.details;
          this.storesFilterData = result?.data[0]?.collection["5162"]?.details;
          this.subTotalPriceLevelData = result?.data[0]?.collection["5162"];
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
