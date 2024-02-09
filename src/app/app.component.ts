import { Component } from "@angular/core";
import { ColDef } from "ag-grid-community";
import { AuthService } from "./auth.service";
import { AppService } from "./app.service";
import { CurrencyRenderer } from "./utils/app.util";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  rowData: any;
  constructor(
    private authService: AuthService,
    private appService: AppService
  ) {}

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    {
      field: "store_code",
      cellRenderer: this.DataRender,
      wrapText: true,
      autoHeight: true,
    },
    { field: "store_name" },
    { field: "sub_total_disc" },
    { field: "sub_total_gross", cellRenderer: CurrencyRenderer },
    { field: "sub_total_net_amount", cellRenderer: CurrencyRenderer },
    { field: "sub_total_quantity" },
  ];

  // itemreportbypricelevelshift() {
  //   // console.log(this.searchTo);
  //   this.appService.itemreportbypricelevelshift("json").subscribe((result) => {
  //     console.log(result);
  //     this.rowData = result.data;
  //   });
  // }

  title = "synverse";
  DataRender(params: any) {
    console.log(params);
    return `code: ${params.data.store_code} <br/> name:${params.data.store_name}`;
  }
}
