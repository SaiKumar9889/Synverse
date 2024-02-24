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
  selector: "app-payment-type",
  templateUrl: "./payment-type.component.html",
  styleUrls: ["./payment-type.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PaymentTypeComponent implements OnInit {
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
  terminal_code: any;
  terminal_name: any;
  subTotalTerminal: any;

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private datePipe: DatePipe
  ) {
    this.authService.login().subscribe((result) => {
      if (result && result.access_token) {
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.paymentType();
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
    this.paymentType();
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

  selectedPaymentId: any;
  paymentIdValue: string[] = [];
  paymentId: any[] = [
    { value: "MASTER", viewValue: "MASTER" },
    { value: "PC01", viewValue: "Payment 1" },
    { value: "VISA", viewValue: "VISA" },
  ];
  onPaymentChange(event: any): void {
    setTimeout(() => {
      if (this.selectedPaymentItems.includes("all")) {
        this.paymentIdValue = this.paymentId.map((item) => item.value);
        // this.paymentIdValue = "%5B%22MASTER%22,%22PC01%22,%22VISA%22%5D";
      } else {
        this.paymentIdValue = event.value;
      }
    }, 500);
  }
  selectedPaymentItems: string[] = [];

  selectPaymentAll() {
    if (this.selectedPaymentItems.includes("all")) {
      this.selectedPaymentItems = this.paymentId.map((item) => item.value);
      this.selectedPaymentItems.push("all");
    } else {
      this.selectedPaymentItems.length = 0;
      this.selectedPaymentItems = [];
    }
  }

  isChecked: boolean;
  isCheckedShift: boolean;
  ngOnInit(): void {
    // Retrieve the stored checkbox state from localStorage
    const storedState = localStorage.getItem("checkboxState");

    // If a state is stored, use it; otherwise, default to false
    this.isChecked = storedState ? JSON.parse(storedState) : false;

    const shiftState = localStorage.getItem("checkboxState");

    // If a state is stored, use it; otherwise, default to false
    this.isCheckedShift = shiftState ? JSON.parse(shiftState) : false;
    this.logCheckboxState();
    this.shiftCheckboxState();
  }

  isCheckbox: string;
  isCheckboxShift: string;
  onCheckboxChange(event: any): void {
    this.isChecked = event.checked;

    // Store the checkbox state in localStorage
    localStorage.setItem("checkboxState", JSON.stringify(this.isChecked));

    // Print "true" or "false" based on the checkbox state
    this.logCheckboxState();
  }

  onShiftChange(event: any): void {
    this.isCheckedShift = event.checked;

    // Store the checkbox state in localStorage
    localStorage.setItem("checkboxState", JSON.stringify(this.isCheckedShift));

    // Print "true" or "false" based on the checkbox state
    this.shiftCheckboxState();
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
  shiftCheckboxState(): void {
    // Print "true" or "false" based on the current checkbox state
    if (this.isCheckedShift) {
      console.log("true");
      this.isCheckboxShift = "true";
    } else {
      console.log("false");
      this.isCheckboxShift = "false";
    }
  }
  errorMessage = null;
  paidAmount: any;
  roundAdj: any;
  visaData: any;
  visaDataSubtotal: any;
  masterData: any;
  masterDataSubtotal: any;
  subTotalDataT1: any;
  subTotalT1: any;
  filteredDataT2: any;
  paidAmountT2: any;
  subTotalDataT2: any;
  subTotalT2: any;
  filteredDataT3: any;
  paidAmountT3: any;
  subTotalDataT3: any;
  subTotalT3: any;

  filteredDataT4: any;
  paidAmountT4: any;
  subTotalDataT4: any;
  subTotalT4: any;

  filteredDataT5: any;
  paidAmountT5: any;
  subTotalDataT5: any;
  subTotalT5: any;

  filteredDataT6: any;
  paidAmountT6: any;
  subTotalDataT6: any;
  subTotalT6: any;
  subTotalSC01: any;
  paymentType() {
    this.errorMessage = null;
    this.appService
      .paymentType(
        "json",
        this.searchFrom,
        this.searchTo,
        this.storeIdValue && this.storeIdValue.length
          ? JSON.stringify(this.storeIdValue)
          : "",
        this.terminalIdValue && this.terminalIdValue.length
          ? JSON.stringify(this.terminalIdValue)
          : "",
        this.paymentIdValue && this.paymentIdValue.length
          ? JSON.stringify(this.paymentIdValue)
          : "",
        this.isCheckbox,
        this.isCheckboxShift
      )
      .subscribe(async (result) => {
        if (result && result.success == false) {
          console.log(result.message);
          // if (result.data && result.data.group_key) {
          this.errorMessage = result.message;
          console.log(this.errorMessage);
          // }
        }
        if (result) {
          this.store_code = result?.data[0]?.store_code;
          this.store_name = result?.data[0]?.store_name;
          this.terminal_name = result?.data[0]?.payment?.T1.terminal_desc;
          this.filteredData = Object.values(
            result?.data[0]?.payment.T1[""]["Payment 1"] || {}
          );
          this.filteredData.splice(-3);
          console.log();
          this.paidAmount =
            result?.data[0]?.payment.T1[""]["Payment 1"].paid_amt;
          this.roundAdj =
            result?.data[0]?.payment.T1[""]["Payment 1"].round_adj;
          this.visaData = result?.data[0]?.payment.T1[""]["VISA"][0];
          this.visaDataSubtotal = result?.data[0]?.payment.T1[""]["VISA"];
          this.masterData = result?.data[0]?.payment.T1[""]["MASTER"][0];
          this.masterDataSubtotal = result?.data[0]?.payment.T1[""]["MASTER"];
          this.subTotalDataT1 = result?.data[0]?.payment.T1[""];
          this.subTotalT1 = result?.data[0]?.payment.T1;
          this.filteredDataT2 = Object.values(
            result?.data[0]?.payment.T2[""]["Payment 1"] || {}
          );
          this.filteredDataT2.splice(-3);
          this.paidAmountT2 = result?.data[0]?.payment.T2[""]["Payment 1"];
          this.subTotalDataT2 = result?.data[0]?.payment.T2[""];
          this.subTotalT2 = result?.data[0]?.payment.T2;
          this.filteredDataT3 = Object.values(
            result?.data[0]?.payment.T3[""]["Payment 1"] || {}
          );
          this.filteredDataT3.splice(-3);
          this.paidAmountT3 = result?.data[0]?.payment.T3[""]["Payment 1"];
          this.subTotalDataT3 = result?.data[0]?.payment.T3[""];
          this.subTotalT3 = result?.data[0]?.payment.T3;

          this.filteredDataT4 = Object.values(
            result?.data[0]?.payment.T4[""]["Payment 1"] || {}
          );
          this.filteredDataT4.splice(-3);
          this.paidAmountT4 = result?.data[0]?.payment.T4[""]["Payment 1"];
          this.subTotalDataT4 = result?.data[0]?.payment.T4[""];
          this.subTotalT4 = result?.data[0]?.payment.T4;

          this.filteredDataT5 = Object.values(
            result?.data[0]?.payment.T5[""]["Payment 1"] || {}
          );
          this.filteredDataT5.splice(-3);
          this.paidAmountT5 = result?.data[0]?.payment.T5[""]["Payment 1"];
          this.subTotalDataT5 = result?.data[0]?.payment.T5[""];
          this.subTotalT5 = result?.data[0]?.payment.T5;

          this.filteredDataT6 = Object.values(
            result?.data[0]?.payment.T6[""]["Payment 1"] || {}
          );
          this.filteredDataT6.splice(-3);
          this.paidAmountT6 = result?.data[0]?.payment.T6[""]["Payment 1"];
          this.subTotalDataT6 = result?.data[0]?.payment.T6[""];
          this.subTotalT6 = result?.data[0]?.payment.T6;
          this.subTotalSC01 = result?.data[0];
          this.grandTotalData = result;
          // this.storesFilterData = Object.values(

          //   result?.data[0]?.payment[0][""]["Payment 1"] || {}
          // );
          // this.subTotalTerminal = result?.data[0]?.sold_item[0];
          // this.subTotalData = result?.data[0];
          // this.grandTotalData = result;
          // this.filteredData = this.storesFilterData;
          this.loadingSpinner = false;
        }
      });
  }

  // async readFile(file: any): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     const reader: FileReader = new FileReader();

  //     reader.onload = (e: any) => {
  //       const binaryString: string = e.target.result;
  //       const workbook: XLSX.WorkBook = XLSX.read(binaryString, {
  //         type: "binary",
  //       });
  //       const sheetName: string = workbook.SheetNames[0];
  //       const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

  //       const jsonArray: any[] = XLSX.utils.sheet_to_json(worksheet, {
  //         raw: false,
  //       });
  //       // console.log(jsonArray);
  //       resolve(jsonArray);
  //     };

  //     reader.onerror = (error) => {
  //       reject(error);
  //     };

  //     reader.readAsBinaryString(file);
  //   });
  // }

  // downloadExcel(): void {
  //   // Make the API call to get the Blob data
  //   this.appService
  //     .paymentType(
  //       "xls",
  //       this.searchFrom,
  //       this.searchTo,
  //       this.storeIdValue,
  //       this.terminalIdValue,
  //       this.paymentIdValue,
  //       this.isCheckbox,
  //       this.isCheckboxShift
  //     )
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
