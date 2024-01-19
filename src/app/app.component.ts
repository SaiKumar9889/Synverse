import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AuthService } from './auth.service';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private appService: AppService
  ) {
    this.authService.login().subscribe((result) => {
      console.log(result);
      if (result && result.access_token) {
        authService.setToken(result.access_token);
        authService.setRefreshToken(result.refresh_token);
        this.itemreportbypricelevelshift();
      }
    });
  }
  title = 'synverse';

  rowData = [];

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    { field: 'store_code' },
    { field: 'store_name' },
    { field: 'sub_total_disc' },
    { field: 'sub_total_gross' },
    { field: 'sub_total_net_amount' },
    { field: 'sub_total_quantity' },
  ];

  itemreportbypricelevelshift() {
    this.appService.itemreportbypricelevelshift('json').subscribe((result) => {
      console.log(result.data);
      if (result) {
        this.rowData = result.data;
      }
    });
  }
}
