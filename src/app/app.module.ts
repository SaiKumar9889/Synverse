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
import { TerminalCollectionComponent } from './components/terminal-collection/terminal-collection.component';
import { SalesRemarkComponent } from './components/sales-remark/sales-remark.component';
import { HourSalesComponent } from './components/hour-sales/hour-sales.component';
import { SoldItemAnlysisComponent } from './components/sold-item-anlysis/sold-item-anlysis.component';
import { OperatorCollectionComponent } from './components/operator-collection/operator-collection.component';
import { AverageSalesSummaryComponent } from './components/average-sales-summary/average-sales-summary.component';

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
    MatMomentDateModule,
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
