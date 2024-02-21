import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSalesComponent } from './transaction-sales.component';

describe('TransactionSalesComponent', () => {
  let component: TransactionSalesComponent;
  let fixture: ComponentFixture<TransactionSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionSalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
