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
  selectedNavItem: string = "priceLevelShift";

  onNavItemClicked(item: string): void {
    this.selectedNavItem = item;
    this.router.navigate([item]);
    localStorage.setItem("selectedNavItem", item);
  }
  ngOnInit(): void {
    const savedNavItem = localStorage.getItem("selectedNavItem");
    if (savedNavItem) {
      this.selectedNavItem = savedNavItem;
    }
  }
}
