import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentSalesComponent } from './department-sales.component';

describe('DepartmentSalesComponent', () => {
  let component: DepartmentSalesComponent;
  let fixture: ComponentFixture<DepartmentSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentSalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
