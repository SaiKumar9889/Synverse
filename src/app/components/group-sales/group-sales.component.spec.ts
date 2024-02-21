import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSalesComponent } from './group-sales.component';

describe('GroupSalesComponent', () => {
  let component: GroupSalesComponent;
  let fixture: ComponentFixture<GroupSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupSalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
