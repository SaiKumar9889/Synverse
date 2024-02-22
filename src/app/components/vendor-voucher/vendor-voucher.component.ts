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

  storeIdValue: string = "%5B%22SC01%22%5D";
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

  selectedShiftId: any;
  shiftValue: string = "";
  shiftId: any[] = [
    { value: "%5B%22SC01%22%5D", viewValue: "Morning Shift" },
    { value: "%5B%22SC02%22%5D", viewValue: "Evening Shift" },
  ];
  onShiftChange(event: any): void {
    this.shiftValue = event.value;
    console.log("Selection change event:", event.value);
  }

  operatorValue: string = "";
  selectedOperator: any;
  operators: any[] = [{ value: "%5B%22SYNV%22%5D", viewValue: "SYNV" }];
  onOperatorChange(event: any): void {
    this.operatorValue = event.value;
    console.log("Selection change event:", event.value);
  }

  vendorVoucher() {
    this.appService
      .vendorVoucher(
        "xls",
        this.searchFrom,
        this.searchTo,
        this.storeIdValue,
        this.terminalIdValue,
        this.groupIdValue,
        this.departmentIdValue,
        this.shiftValue,
        this.operatorValue,
        this.categoryIdValue,
        this.stockIdValue
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
