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
        this.vendorVoucher();
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
    this.vendorVoucher();
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
        // this.shiftValue = "%5B%22SC01%22,%22SC02%22%5D";
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

  vendorVoucher() {
    this.appService
      .vendorVoucher(
        "xls",
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
        const excelData = await this.readFile(result);
        this.rows = [];
        this.columns = Object.values(excelData[1]);
        this.columns.splice(8, 1);
        let values = null;
        let data = {};
        // console.log("conlumns : ", this.columns);
        for (let i = 2; i < excelData.length; i++) {
          let data: any = {};
          values = Object.values(excelData[i]);
          // console.log();
          // console.log(values);
          if (values.length == this.columns.length) {
            for (let j = 0; j < this.columns.length; j++) {
              data[this.columns[j]] = values[j];
            }
            this.rows.push(data);
          }
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
