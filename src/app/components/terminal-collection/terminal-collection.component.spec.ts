import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalCollectionComponent } from './terminal-collection.component';

describe('TerminalCollectionComponent', () => {
  let component: TerminalCollectionComponent;
  let fixture: ComponentFixture<TerminalCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalCollectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
