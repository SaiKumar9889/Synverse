import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PriceLevelShiftComponent } from "./components/price-level-shift/price-level-shift.component";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { TransactionDetailsComponent } from "./components/transaction-details/transaction-details.component";
import { TerminalCollectionComponent } from "./components/terminal-collection/terminal-collection.component";
import { SalesRemarkComponent } from "./components/sales-remark/sales-remark.component";
import { HourSalesComponent } from "./components/hour-sales/hour-sales.component";
import { SoldItemAnlysisComponent } from "./components/sold-item-anlysis/sold-item-anlysis.component";
import { OperatorCollectionComponent } from "./components/operator-collection/operator-collection.component";
import { AverageSalesSummaryComponent } from "./components/average-sales-summary/average-sales-summary.component";
import { TaxTransactionComponent } from "./components/tax-transaction/tax-transaction.component";
import { PaymentTypeComponent } from "./components/payment-type/payment-type.component";
import { VendorVoucherComponent } from "./components/vendor-voucher/vendor-voucher.component";
import { ReceiptAnalysisComponent } from "./components/receipt-analysis/receipt-analysis.component";
import { SkuSalesComponent } from "./components/sku-sales/sku-sales.component";
import { GroupSalesComponent } from "./components/group-sales/group-sales.component";
import { DepartmentSalesComponent } from "./components/department-sales/department-sales.component";

const routes: Routes = [
  { path: "", component: PriceLevelShiftComponent },
  { path: "priceLevelShift", component: PriceLevelShiftComponent },
  { path: "transactionDetails", component: TransactionDetailsComponent },
  { path: "terminalCollection", component: TerminalCollectionComponent },
  { path: "salesRemark", component: SalesRemarkComponent },
  { path: "hourSales", component: HourSalesComponent },
  { path: "soldItemAnalysis", component: SoldItemAnlysisComponent },
  { path: "operatorCollection", component: OperatorCollectionComponent },
  { path: "averageSalesSummary", component: AverageSalesSummaryComponent },
  { path: "taxTransaction", component: TaxTransactionComponent },
  { path: "paymentType", component: PaymentTypeComponent },
  { path: "vendorVoucher", component: VendorVoucherComponent },
  { path: "receiptAnalysis", component: ReceiptAnalysisComponent },
  { path: "skuSales", component: SkuSalesComponent },
  { path: "groupSales", component: GroupSalesComponent },
  { path: "departmentSales", component: DepartmentSalesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
