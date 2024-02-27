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
  selector: "app-category-sales",
  templateUrl: "./category-sales.component.html",
  styleUrls: ["./category-sales.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CategorySalesComponent {
  [x: string]: any;
  store_code: any;
  store_name: any;
  storeData: any = [];
  storesFilterData: any = [];
  subTotalPriceLevelData: any;
  subTotalData: any;
  searchFrom: any = "2019-03-01";
  searchTo: any = "2023-05-31";
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
        this.categorySales();
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

  storeIdValue: string[] = ["SC01"];
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

  applyDateFilter() {
    this.categorySales();
  }

  errorMessage: any;
  categorySales() {
    console.log(this.searchFrom);
    this.appService
      .categorySales("json", this.searchFrom, this.searchTo, this.storeIdValue)
      .subscribe((result) => {
        console.log(result);
        if (result && result.status == "failed") {
          console.log(result.message);
          // if (result.data && result.data.group_key) {
          this.errorMessage = result.message;
          console.log(this.errorMessage);
          this.loadingSpinner = false;
          // }
        }
        // const excelData = await this.readFile(result);
        // this.rows = [];
        // this.columns = Object.values(excelData[1]);
        // this.columns.splice(8, 1);
        // let values = null;
        // let data = {};
        // // console.log("conlumns : ", this.columns);
        // for (let i = 2; i < excelData.length; i++) {
        //   let data: any = {};
        //   values = Object.values(excelData[i]);
        //   // console.log();
        //   // console.log(values);
        //   if (values.length == this.columns.length) {
        //     for (let j = 0; j < this.columns.length; j++) {
        //       data[this.columns[j]] = values[j];
        //     }
        //     this.rows.push(data);
        //   }
        // }
        // // console.log(this.rows);
        // this.loadingSpinner = false;
        // this.displayTable = true;
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
  //     .vendorVoucher("xls", this.searchFrom, this.searchTo)
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
