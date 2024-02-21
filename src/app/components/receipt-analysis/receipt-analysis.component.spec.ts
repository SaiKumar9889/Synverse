import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptAnalysisComponent } from './receipt-analysis.component';

describe('ReceiptAnalysisComponent', () => {
  let component: ReceiptAnalysisComponent;
  let fixture: ComponentFixture<ReceiptAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
