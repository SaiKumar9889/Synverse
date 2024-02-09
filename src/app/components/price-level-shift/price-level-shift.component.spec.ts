import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceLevelShiftComponent } from './price-level-shift.component';

describe('PriceLevelShiftComponent', () => {
  let component: PriceLevelShiftComponent;
  let fixture: ComponentFixture<PriceLevelShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceLevelShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceLevelShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
