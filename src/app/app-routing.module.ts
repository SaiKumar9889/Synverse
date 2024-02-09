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

const routes: Routes = [
  { path: "", component: PriceLevelShiftComponent },
  { path: "priceLevelShift", component: PriceLevelShiftComponent },
  { path: "transaction", component: TransactionDetailsComponent },
  { path: "terminalCollection", component: TerminalCollectionComponent },
  { path: "salesRemark", component: SalesRemarkComponent },
  { path: "hourSales", component: HourSalesComponent },
  { path: "soldItemAnalysis", component: SoldItemAnlysisComponent },
  { path: "operatorCollection", component: OperatorCollectionComponent },
  { path: "averageSalesSummary", component: AverageSalesSummaryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
