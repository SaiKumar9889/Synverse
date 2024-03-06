import {
  Component,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { MediaMatcher } from "@angular/cdk/layout";
import { Router } from "@angular/router";

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.css"],
})
export class SidenavComponent implements OnInit {
  mobileQuery: MediaQueryList;
  priceLevelFormFields: boolean = false;
  operationReports: boolean = false;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("change", this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener("change", this._mobileQueryListener);
  }
  selectedNavItem: string = "transactionDetails";

  onNavItemClicked(item: string): void {
    this.selectedNavItem = item;
    this.router.navigate([item]);
    localStorage.setItem("selectedNavItem", item);
  }
  ngOnInit(): void {
    localStorage.setItem("selectedNavItem", this.selectedNavItem);
    const savedNavItem = localStorage.getItem("selectedNavItem");
    if (savedNavItem) {
      this.selectedNavItem = savedNavItem;
      this.transactionReport();
      this.operationReport();
      this.router.navigate([this.selectedNavItem]);
      console.log(this.selectedNavItem);
    }
  }
  transactionReport() {
    if (
      this.selectedNavItem === "transactionDetails" ||
      this.selectedNavItem === "paymentType" ||
      this.selectedNavItem === "terminalCollection"
    ) {
      this.priceLevelFormFields = true;
    } else {
      this.priceLevelFormFields = false;
    }
  }
  operationReport() {
    if (
      this.selectedNavItem === "hourSales" ||
      this.selectedNavItem === "taxTransaction" ||
      this.selectedNavItem === "categorySales" ||
      this.selectedNavItem === "departmentSales" ||
      this.selectedNavItem === "groupSales" ||
      this.selectedNavItem === "skuSales" ||
      this.selectedNavItem === "transactionSales" ||
      this.selectedNavItem === "transactionVoid" ||
      this.selectedNavItem === "priceLevelShift" ||
      this.selectedNavItem === "salesRemark" ||
      this.selectedNavItem === "soldItemAnalysis" ||
      this.selectedNavItem === "operatorCollection" ||
      this.selectedNavItem === "vendorVoucher" ||
      this.selectedNavItem === "storeVoucher" ||
      this.selectedNavItem === "receiptAnalysis" ||
      this.selectedNavItem === "inactiveStock" ||
      this.selectedNavItem === "averageSalesSummary"
    ) {
      this.operationReports = true;
    } else {
      this.operationReports = false;
    }
  }
  formFieldsAdded() {
    this.priceLevelFormFields = true;
    this.operationReports = false;
  }
  formFieldsRemoved() {
    this.priceLevelFormFields = false;
  }
  operationReportsAdded() {
    this.operationReports = true;
    this.priceLevelFormFields = false;
  }
  operationReportsRemoved() {
    this.operationReports = false;
  }
}
