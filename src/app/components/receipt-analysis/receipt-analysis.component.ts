import { Component } from "@angular/core";
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
  selector: "app-receipt-analysis",
  templateUrl: "./receipt-analysis.component.html",
  styleUrls: ["./receipt-analysis.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ReceiptAnalysisComponent {
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
  constructor(
    private authService: AuthService,
    private appService: AppService,
    private datePipe: DatePipe
  ) {
    this.authService.login().subscribe((result) => {
      if (result && result.access_token) {
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.receiptAnalysis();
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
    this.receiptAnalysis();
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

  // public blobToFile = (theBlob: Blob, fileName: string): File => {
  //   return new File(
  //     [theBlob as any], // cast as any
  //     fileName,
  //     {
  //       lastModified: new Date().getTime(),
  //       type: theBlob.type,
  //     }
  //   );
  // };

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

  term1: any;
  terminal: any;
  subTotalTerminal: any;

  isChecked: boolean;
  isCheckedCombine: boolean;
  isCheckedNormal: boolean;
  isCheckedRemark: boolean;

  ngOnInit(): void {
    // Retrieve the stored checkbox state from localStorage
    const storedState = localStorage.getItem("checkboxState");

    // If a state is stored, use it; otherwise, default to false
    this.isChecked = storedState ? JSON.parse(storedState) : false;
    this.logCheckboxState();
    const combinedState = localStorage.getItem("combineState");

    // If a state is stored, use it; otherwise, default to false
    this.isCheckedCombine = combinedState ? JSON.parse(combinedState) : false;
    this.logCombineState();
    const normalState = localStorage.getItem("normalState");

    // If a state is stored, use it; otherwise, default to false
    this.isCheckedNormal = normalState ? JSON.parse(normalState) : false;
    this.logNormalState();

    const remarkState = localStorage.getItem("remarkState");

    // If a state is stored, use it; otherwise, default to false
    this.isCheckedRemark = remarkState ? JSON.parse(remarkState) : false;
    this.logRemarkState();
  }

  isCheckbox: string = "F";

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
      this.isCheckbox = "T";
    } else {
      console.log("false");
      this.isCheckbox = "F";
    }
  }
  isCombine: string = "F";

  onCombineChange(event: any): void {
    this.isCheckedCombine = event.checked;

    // Store the checkbox state in localStorage
    localStorage.setItem("combineState", JSON.stringify(this.isCheckedCombine));

    // Print "true" or "false" based on the checkbox state
    this.logCombineState();
  }

  logCombineState(): void {
    // Print "true" or "false" based on the current checkbox state
    if (this.isCheckedCombine) {
      console.log("true");
      this.isCombine = "T";
    } else {
      console.log("false");
      this.isCombine = "F";
    }
  }

  isNormal: string = "F";

  onNormalChange(event: any): void {
    this.isCheckedNormal = event.checked;

    // Store the checkbox state in localStorage
    localStorage.setItem("normalState", JSON.stringify(this.isCheckedNormal));

    // Print "true" or "false" based on the checkbox state
    this.logNormalState();
  }

  logNormalState(): void {
    // Print "true" or "false" based on the current checkbox state
    if (this.isCheckedNormal) {
      console.log("true");
      this.isNormal = "T";
    } else {
      console.log("false");
      this.isNormal = "F";
    }
  }

  isRemark: string = "F";

  onRemarkChange(event: any): void {
    this.isCheckedRemark = event.checked;

    // Store the checkbox state in localStorage
    localStorage.setItem("remarkState", JSON.stringify(this.isCheckedRemark));

    // Print "true" or "false" based on the checkbox state
    this.logRemarkState();
  }

  logRemarkState(): void {
    // Print "true" or "false" based on the current checkbox state
    if (this.isCheckedRemark) {
      console.log("true");
      this.isRemark = "T";
    } else {
      console.log("false");
      this.isRemark = "F";
    }
  }
  errorMessage: any;
  receiptAnalysis() {
    this.appService
      .receiptAnalysis(
        "json",
        this.searchFrom,
        this.searchTo,
        this.storeIdValue,
        this.terminalIdValue,
        this.isCheckbox,
        this.isCombine,
        this.isNormal,
        this.isRemark
      )
      .subscribe((result) => {
        if (result && result.data == "") {
          console.log(result.message);
          // if (result.data && result.data.group_key) {
          this.errorMessage = "No Data Found";
          console.log(this.errorMessage);
          // }
        }
        this.store_code = result.data[0].terminal_code;
        this.store_name = result.data[0].terminal_desc;
        if (result) {
          this.storeData = result.data;

          this.storesFilterData = result.data;

          // this.subTotalPriceLevelData = result.data[0].item_price.P1;
          this.subTotalTerminal = result.data[0].terminal[0];
          this.subTotalData = result.data[0];
          this.grandTotalData = result;
          this.filteredData = this.storesFilterData;
          console.log(this.grandTotalData);
          this.loadingSpinner = false;
        }
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
  //     .paymentType("xls", this.searchFrom, this.searchTo)
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
