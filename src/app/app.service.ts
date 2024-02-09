import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AppService {
  private apiUrl = "https://synverse.qubeapi.com/api";

  constructor(private http: HttpClient) {}

  itemreportbypricelevelshift(fileType: string, start: string, end: string) {
    const url = `${this.apiUrl}/bereport/itemreportbypricelevelshift?start_date=${start}&end_date=${end}&sort_key=SDTL_STORE&store_id=&datetype=lyear&file_type=${fileType}&price_shift=%5B%22S1%22%5D&price_level=&stock_code=`;
    return this.http.get<any>(url);
  }
  terminalCollection(fileType: string, start: string, end: string) {
    const url = `${this.apiUrl}/bereport/terminalcollectionreport?start_date=${start}&end_date=${end}&sort_key=PYMT_CLOSEDATE&datetype=lyear&file_type=${fileType}`;
    return this.http.get<any>(url);
  }
  salesRemark(fileType: string, start: string, end: string) {
    const url = `${this.apiUrl}/bereport/salesremark?start_date=${start}&end_date=${end}&sort_key=SALES_REMARK1&store_id=&datetype=lyear&file_type=${fileType}&terminal_id=&void=`;
    return this.http.get<any>(url);
  }
  hourlySales(fileType: string, start: string, end: string) {
    const url = `${this.apiUrl}/bereport/hourlysalesreportjson?start_date=${start}&end_date=${end}&group_key=store&datetype=lyear&file_type=${fileType}`;
    return this.http.get<any>(url);
  }
  soldItemAnalysis(start: string, end: string) {
    const url = `${this.apiUrl}/bereport/solditemanalysis?file_type=json&store_id=&start_date=${start}&end_date=${end}&datetype=lyear&price=F&item=F&foc=F&discount=F&transaction_void=T&combine_void=T&normal_sales=F&terminal_id&stock_code=&group&department&category`;
    return this.http.get<any>(url);
  }
  operatorCollection(fileType: string, start: string, end: string) {
    const url = `${this.apiUrl}/bereport/operatorcollection?file_type=${fileType}&store_id=&start_date=${start}&end_date=${end}&datetype=lyear&operator_id`;
    return this.http.get<any>(url);
  }
  averageSalesSummary(fileType: string, start: string, end: string) {
    const url = `${this.apiUrl}/bereport/averagesalessummary?file_type=${fileType}&store_id=&start_date=${start}&end_date=${end}&datetype=lyear&is_tax_included=F&sales_value=total`;
    return this.http.get<any>(url);
  }
}
