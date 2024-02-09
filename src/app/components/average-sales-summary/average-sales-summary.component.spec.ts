import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageSalesSummaryComponent } from './average-sales-summary.component';

describe('AverageSalesSummaryComponent', () => {
  let component: AverageSalesSummaryComponent;
  let fixture: ComponentFixture<AverageSalesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AverageSalesSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AverageSalesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
