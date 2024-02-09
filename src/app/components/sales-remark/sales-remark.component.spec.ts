import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesRemarkComponent } from './sales-remark.component';

describe('SalesRemarkComponent', () => {
  let component: SalesRemarkComponent;
  let fixture: ComponentFixture<SalesRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesRemarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
