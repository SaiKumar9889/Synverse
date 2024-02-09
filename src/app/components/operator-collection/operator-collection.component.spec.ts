import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorCollectionComponent } from './operator-collection.component';

describe('OperatorCollectionComponent', () => {
  let component: OperatorCollectionComponent;
  let fixture: ComponentFixture<OperatorCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorCollectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
