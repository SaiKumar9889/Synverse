import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionVoidComponent } from './transaction-void.component';

describe('TransactionVoidComponent', () => {
  let component: TransactionVoidComponent;
  let fixture: ComponentFixture<TransactionVoidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionVoidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionVoidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
