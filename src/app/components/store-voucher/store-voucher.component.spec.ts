import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreVoucherComponent } from './store-voucher.component';

describe('StoreVoucherComponent', () => {
  let component: StoreVoucherComponent;
  let fixture: ComponentFixture<StoreVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
