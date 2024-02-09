import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldItemAnlysisComponent } from './sold-item-anlysis.component';

describe('SoldItemAnlysisComponent', () => {
  let component: SoldItemAnlysisComponent;
  let fixture: ComponentFixture<SoldItemAnlysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoldItemAnlysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoldItemAnlysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
