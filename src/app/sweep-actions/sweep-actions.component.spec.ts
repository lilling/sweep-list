import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SweepActionsComponent } from './sweep-actions.component';

describe('SweepActionsComponent', () => {
  let component: SweepActionsComponent;
  let fixture: ComponentFixture<SweepActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SweepActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SweepActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
