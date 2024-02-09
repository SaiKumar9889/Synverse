import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourSalesComponent } from './hour-sales.component';

describe('HourSalesComponent', () => {
  let component: HourSalesComponent;
  let fixture: ComponentFixture<HourSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HourSalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HourSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
