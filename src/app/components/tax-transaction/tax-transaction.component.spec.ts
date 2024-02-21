import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxTransactionComponent } from './tax-transaction.component';

describe('TaxTransactionComponent', () => {
  let component: TaxTransactionComponent;
  let fixture: ComponentFixture<TaxTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
