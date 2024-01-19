import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private apiUrl = 'https://synverse.qubeapi.com/api';

  constructor(private http: HttpClient) {}

  itemreportbypricelevelshift(fileType: string) {
    const url = `${this.apiUrl}/bereport/itemreportbypricelevelshift?start_date=&end_date=&sort_key=SDTL_STORE&store_id=&datetype=lyear&file_type=${fileType}&price_shift=%5B%22S1%22%5D&price_level=&stock_code=`;
    return this.http.get<any>(url);
  }
}
