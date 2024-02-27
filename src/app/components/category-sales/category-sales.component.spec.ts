import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySalesComponent } from './category-sales.component';

describe('CategorySalesComponent', () => {
  let component: CategorySalesComponent;
  let fixture: ComponentFixture<CategorySalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorySalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
