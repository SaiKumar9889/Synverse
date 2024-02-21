import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorVoucherComponent } from './vendor-voucher.component';

describe('VendorVoucherComponent', () => {
  let component: VendorVoucherComponent;
  let fixture: ComponentFixture<VendorVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
