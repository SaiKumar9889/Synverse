import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AgGridAngular } from "ag-grid-angular";
import { AuthService } from "./auth.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "./token.interceptor";
import { AppService } from "./app.service";
import { MaterialModule } from "./material.module";
import { PriceLevelShiftComponent } from "./components/price-level-shift/price-level-shift.component";
import { TransactionDetailsComponent } from "./components/transaction-details/transaction-details.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DecimalFormatPipe } from "./Pipe/decimal-format.pipe";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
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
import { LoaderComponent } from "./components/loader/loader.component";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { SkuSalesComponent } from "./components/sku-sales/sku-sales.component";
import { GroupSalesComponent } from "./components/group-sales/group-sales.component";
import { DepartmentSalesComponent } from "./components/department-sales/department-sales.component";
import { TransactionSalesComponent } from "./components/transaction-sales/transaction-sales.component";
import { TransactionVoidComponent } from "./components/transaction-void/transaction-void.component";
import { NgxPaginationModule } from "ngx-pagination";
import { InactiveStockComponent } from './components/inactive-stock/inactive-stock.component';
import { CategorySalesComponent } from './components/category-sales/category-sales.component';
import { StoreVoucherComponent } from './components/store-voucher/store-voucher.component';

@NgModule({
  declarations: [
    AppComponent,
    PriceLevelShiftComponent,
    TransactionDetailsComponent,
    DecimalFormatPipe,
    SidenavComponent,
    TerminalCollectionComponent,
    SalesRemarkComponent,
    HourSalesComponent,
    SoldItemAnlysisComponent,
    OperatorCollectionComponent,
    AverageSalesSummaryComponent,
    TaxTransactionComponent,
    PaymentTypeComponent,
    VendorVoucherComponent,
    ReceiptAnalysisComponent,
    LoaderComponent,
    SkuSalesComponent,
    GroupSalesComponent,
    DepartmentSalesComponent,
    TransactionSalesComponent,
    TransactionVoidComponent,
    InactiveStockComponent,
    CategorySalesComponent,
    StoreVoucherComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AgGridAngular,
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatMomentDateModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.cubeGrid,
      backdropBackgroundColour: "rgba(0,0,0,0.1)",
      fullScreenBackdrop: true,
      backdropBorderRadius: "4px",
      primaryColour: "#ffffff",
      secondaryColour: "#ffffff",
      tertiaryColour: "#ffffff",
    }),
  ],
  providers: [
    AppService,
    AuthService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
