import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as XLSX from "xlsx";

@Injectable({
  providedIn: "root",
})
export class AppService {
  private apiUrl = "https://synverse.qubeapi.com/api";

  constructor(private http: HttpClient) {}

  itemreportbypricelevelshift(
    fileType: string,
    start: string,
    end: string,
    storeId: string,
    priceId: string,
    stockId: string,
    shiftId: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/itemreportbypricelevelshift?start_date=${start}&end_date=${end}&sort_key=SDTL_STORE&store_id=${storeId}&datetype=${dateType}&file_type=${fileType}&price_shift=${shiftId}&price_level=${priceId}&stock_code=${stockId}`;
    return this.http.get<any>(url);
  }
  terminalCollection(
    fileType: string,
    start: string,
    end: string,
    storeId: string,
    terminalId: string,
    paymentId: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/terminalcollectionreport?start_date=${start}&end_date=${end}&terminal_id=${terminalId}&store_id=${storeId}&payment_type=${paymentId}&sort_key=PYMT_CLOSEDATE&datetype=${dateType}&file_type=${fileType}`;
    return this.http.get<any>(url);
  }
  salesRemark(
    fileType: string,
    start: string,
    end: string,
    storeId: string,
    terminalId: string,
    checkbox: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/salesremark?start_date=${start}&end_date=${end}&sort_key=SALES_REMARK1&store_id=${storeId}&datetype=${dateType}&file_type=${fileType}&terminal_id=${terminalId}&void=${checkbox}`;
    return this.http.get<any>(url);
  }
  hourlySales(
    fileType: string,
    start: string,
    end: string,
    groupId: string,
    storeId: string,
    terminalId: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/hourlysalesreportjson?start_date=${start}&end_date=${end}&terminal_id=${terminalId}&store_id=${storeId}&group_key=${groupId}&datetype=${dateType}&file_type=${fileType}`;
    return this.http.get<any>(url);
  }
  soldItemAnalysis(
    start: string,
    end: string,
    storeId: string,
    terminalId: string,
    groupId: string,
    departmentId: string,
    categoryId: string,
    stockId: string,
    checkbox: string,
    checkboxShift: string,
    checkboxChanged: string,
    checkboxDiscount: string,
    checkboxTransaction: string,
    checkboxCombine: string,
    checkboxNormal: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/solditemanalysis?file_type=json&store_id=${storeId}&start_date=${start}&end_date=${end}&datetype=${dateType}&price=${checkbox}&item=${checkboxShift}&foc=${checkboxChanged}&discount=${checkboxDiscount}&transaction_void=${checkboxTransaction}&combine_void=${checkboxCombine}&normal_sales=${checkboxNormal}&terminal_id=${terminalId}&stock_code=${stockId}&group=${groupId}&department=${departmentId}&category=${categoryId}`;
    return this.http.get<any>(url);
  }
  operatorCollection(
    fileType: string,
    start: string,
    end: string,
    storeId: string,
    operatorId: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/operatorcollection?file_type=${fileType}&store_id=${storeId}&start_date=${start}&end_date=${end}&datetype=${dateType}&operator_id=${operatorId}`;
    return this.http.get<any>(url);
  }
  averageSalesSummary(
    fileType: string,
    start: string,
    end: string,
    storeIdValue: any,
    salesId: any,
    checked: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/averagesalessummary?file_type=${fileType}&store_id=${storeIdValue}&start_date=${start}&end_date=${end}&datetype=${dateType}&is_tax_included=${checked}&sales_value=${salesId}`;
    return this.http.get<any>(url);
  }
  transactionDetail(
    fileType: string,
    start: string,
    end: string,
    storeId: string,
    terminalId: string,
    checkbox: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/transactiondetailanalysisreport?start_date=${start}&end_date=${end}&is_tax_include=${checkbox}&sort_key=PYMT_CTRNO&terminal_id=${terminalId}&store_id=${storeId}&datetype=${dateType}&file_type=${fileType}`;
    return this.http.get<any>(url);
  }
  paymentType(
    fileType: string,
    start: string,
    end: string,
    storeId: string,
    terminalId: string,
    paymentId: string,
    checkbox: string,
    checkboxShift: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/paymentanalysisreport?start_date=${start}&end_date=${end}&store_id=${storeId}&terminal_id=${terminalId}&payment_type=${paymentId}&void=${checkbox}&shift=${checkboxShift}&datetype=${dateType}&file_type=${fileType}`;
    return this.http.get<any>(url);
  }
  inactiveStock(fileType: string) {
    const url = `${this.apiUrl}/bereport/inactivestocklisting?sort_key=M_STOCK_CODE&file_type=${fileType}`;
    return this.http.get<any>(url);
  }
  categorySales(
    fileType: string,
    start: string,
    end: string,
    storeId: any,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/categorysalesresport?file_type=${fileType}&store_id=${storeId}&start_date=${start}&end_date=${end}&datetype=${dateType}`;
    return this.http.get<any>(url);
  }
  storeVoucher(
    fileType: string,
    start: string,
    end: string,
    storeId: any,
    terminal: any,
    shift: any,
    operator: any,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/storevoucher?file_type=${fileType}&store_id=${storeId}&start_date=${start}&end_date=${end}&datetype=${dateType}&operator_id=${operator}&sort_key=SALES_CLOSEDATE&terminal_id=${terminal}&shift_id=${shift}`;
    return this.http.get<any>(url);
  }
  getStores() {
    const url = `${this.apiUrl}/bereport/getstore`;
    return this.http.get<any>(url);
  }
  getTerminal(storeId: any) {
    const url = `${this.apiUrl}/bereport/getterminal?store_id=${storeId}`;
    return this.http.get<any>(url);
  }
  getPayment() {
    const url = `${this.apiUrl}/bereport/getpaymenttype`;
    return this.http.get<any>(url);
  }
  getPriceShift() {
    const url = `${this.apiUrl}/bereport/getpriceshift`;
    return this.http.get<any>(url);
  }
  getPriceLevel() {
    const url = `${this.apiUrl}/bereport/getpricelevel`;
    return this.http.get<any>(url);
  }
  getStock() {
    const url = `${this.apiUrl}/bereport/getstock`;
    return this.http.get<any>(url);
  }
  getShift() {
    const url = `${this.apiUrl}/bereport/getshift`;
    return this.http.get<any>(url);
  }
  getGroup() {
    const url = `${this.apiUrl}/bereport/getgroup`;
    return this.http.get<any>(url);
  }
  getDepartment(groupId: any) {
    const url = `${this.apiUrl}/bereport/getdepartment?group_id=${groupId}`;
    return this.http.get<any>(url);
  }
  getCategory() {
    const url = `${this.apiUrl}/bereport/getcategory`;
    return this.http.get<any>(url);
  }
  getUser() {
    const url = `${this.apiUrl}/bereport/getuser`;
    return this.http.get<any>(url);
  }
  vendorVoucher(
    fileType: string,
    start: string,
    end: string,
    storeId: string,
    terminalId: string,
    groupId: string,
    departmentId: string,
    shiftId: string,
    operatorId: string,
    categoryId: string,
    stockId: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/vendorvoucher?file_type=${fileType}&store_id=${storeId}&start_date=${start}&end_date=${end}&datetype=${dateType}&operator_id=${operatorId}&sort_key=SDTL_CLOSEDATE&terminal_id=${terminalId}&stock_id=${stockId}&group_id=${groupId}&department_id=${departmentId}&category_id=${categoryId}&shift_id=${shiftId}`;
    return this.http.get<any>(url);
  }
  receiptAnalysis(
    fileType: string,
    start: string,
    end: string,
    storeId: string,
    terminalId: string,
    checkbox: string,
    combine: string,
    normal: string,
    remark: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/receiptanalysis?file_type=${fileType}&store_id=${storeId}&start_date=${start}&end_date=${end}&datetype=${dateType}&sort_key=SALES_CLOSEDATE&terminal_id=${terminalId}&void=${checkbox}&combine_void=${combine}&normal_sales=${normal}&remark_not_null=${remark}`;
    return this.http.get<any>(url);
  }
  skuSales(
    fileType: string,
    start: string,
    end: string,
    storeId: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/skusalesresport?file_type=${fileType}&store_id=${storeId}&start_date=${start}&end_date=${end}&datetype=${dateType}`;
    return this.http.get<any>(url);
  }
  groupSales(
    fileType: string,
    start: string,
    end: string,
    storeId: any,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/groupsalesresport?file_type=${fileType}&store_id=${storeId}&start_date=${start}&end_date=${end}&datetype=${dateType}`;
    return this.http.get<any>(url);
  }
  transactionVoid(
    fileType: string,
    start: string,
    end: string,
    storeId: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/transactionvoidreport?file_type=${fileType}&store_id=${storeId}&start_date=${start}&end_date=${end}&datetype=${dateType}`;
    return this.http.get<any>(url);
  }
  transactionSales(
    fileType: string,
    start: string,
    end: string,
    storeId: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/transactionsalesresport?file_type=${fileType}&store_id=${storeId}&start_date=${start}&end_date=${end}&datetype=${dateType}`;
    return this.http.get<any>(url);
  }
  departmentSales(
    fileType: string,
    start: string,
    end: string,
    storeId: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/departmentsalesresport?file_type=${fileType}&store_id=${storeId}&start_date=${start}&end_date=${end}&datetype=${dateType}`;
    return this.http.get<any>(url);
  }

  taxTransaction(
    fileType: string,
    start: string,
    end: string,
    storeId: string,
    terminalId: string,
    checkbox: string,
    dateType: any
  ) {
    const url = `${this.apiUrl}/bereport/taxtransactionreport?start_date=${start}&end_date=${end}&void=${checkbox}&sort_key=SALES_CTRNO&store_id=${storeId}&terminal_id=${terminalId}&datetype=${dateType}&file_type=${fileType}`;
    return this.http.get<any>(url);
  }
}
