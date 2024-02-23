import { Component, OnInit } from "@angular/core";
import { ColDef } from "ag-grid-community";
import { AuthService } from "../../auth.service";
import { AppService } from "../../app.service";
import { CurrencyRenderer } from "../../utils/app.util";
import { MatTableDataSource } from "@angular/material/table";
import * as XLSX from "xlsx";
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
  selector: "app-transaction-details",
  templateUrl: "./transaction-details.component.html",
  styleUrls: ["./transaction-details.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TransactionDetailsComponent implements OnInit {
  [x: string]: any;
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
  isChecked: boolean;

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private datePipe: DatePipe
  ) {
    this.authService.login().subscribe((result) => {
      if (result && result.access_token) {
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.transactionDetail();
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
    this.transactionDetail();
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

  // selectedTerminalId: any;
  terminalIdValue: string = "";
  selectedTerminalItems: string[] = [];
  terminalId: any[] = [{ value: "%5B%22T1%22%5D", viewValue: "Terminal 1" }];

  onTerminalChange(event: any): void {
    setTimeout(() => {
      if (this.selectedTerminalItems.includes("all")) {
        this.terminalIdValue = this.terminalId.map((item) => item.value).join();
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

  ngOnInit(): void {
    // Retrieve the stored checkbox state from localStorage
    const storedState = localStorage.getItem("checkboxState");

    // If a state is stored, use it; otherwise, default to false
    this.isChecked = storedState ? JSON.parse(storedState) : false;
    this.logCheckboxState();
  }

  isCheckbox: string;

  onCheckboxChange(event: any): void {
    this.isChecked = event.checked;

    // Store the checkbox state in localStorage
    localStorage.setItem("checkboxState", JSON.stringify(this.isChecked));

    // Print "true" or "false" based on the checkbox state
    this.logCheckboxState();
  }

  logCheckboxState(): void {
    // Print "true" or "false" based on the current checkbox state
    if (this.isChecked) {
      console.log("true");
      this.isCheckbox = "true";
    } else {
      console.log("false");
      this.isCheckbox = "false";
    }
  }

  transactionDetail() {
    console.log(this.isCheckbox);
    this.appService
      .transactionDetail(
        "xls",
        this.searchFrom,
        this.searchTo,
        this.storeIdValue,
        this.terminalIdValue,
        this.isCheckbox
      )
      .subscribe(async (result) => {
        const excelData = await this.readFile(result);
        this.rows = [];
        this.columns = Object.values(excelData[1]);
        // this.columns.splice(8, 1);
        let values = null;
        let data = {};
        // console.log("conlumns : ", this.columns);
        for (let i = 2; i < excelData.length; i++) {
          let data: any = {};
          values = excelData[i];
          // console.log(values);
          // if (values.length == this.columns.length) {
          //   for (let j = 0; j < this.columns.length; j++) {
          //     data[this.columns[j]] = values[j];
          //   }
          this.rows.push({
            [this.columns[0]]: values["__EMPTY"],
            [this.columns[1]]: values["__EMPTY_1"],
            [this.columns[2]]: values["TAX TRANSACTION DETAIL REPORT"],
            [this.columns[3]]: values["__EMPTY_2"],
            [this.columns[4]]: values["__EMPTY_3"],
            [this.columns[5]]: values["__EMPTY_4"],
            [this.columns[6]]: values["__EMPTY_5"],
            [this.columns[7]]: values["__EMPTY_6"],
            [this.columns[8]]: values["__EMPTY_7"],
            [this.columns[9]]: values["__EMPTY_8"],
            [this.columns[10]]: values["__EMPTY_9"],
            [this.columns[11]]: values["__EMPTY_10"],
            [this.columns[12]]: values["__EMPTY_11"],
            [this.columns[13]]: values["__EMPTY_12"],
          });
          // }
        }
        // console.log(this.rows);
        this.loadingSpinner = false;
        this.displayTable = true;
      });
  }

  async readFile(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        const binaryString: string = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(binaryString, {
          type: "binary",
        });
        const sheetName: string = workbook.SheetNames[0];
        const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

        const jsonArray: any[] = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
        });
        // console.log(jsonArray);
        resolve(jsonArray);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(file);
    });
  }

  // downloadExcel(): void {
  //   // Make the API call to get the Blob data
  //   this.appService
  //     .transactionDetail("xls", this.searchFrom, this.searchTo)
  //     .subscribe((blobData) => {
  //       // Create a download link
  //       const downloadLink = document.createElement("a");
  //       downloadLink.href = window.URL.createObjectURL(blobData);

  //       // Set the file name
  //       downloadLink.download = "example.xlsx";

  //       // Trigger a click event to start the download
  //       document.body.appendChild(downloadLink);
  //       downloadLink.click();

  //       // Cleanup
  //       document.body.removeChild(downloadLink);
  //     });
  // }

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
