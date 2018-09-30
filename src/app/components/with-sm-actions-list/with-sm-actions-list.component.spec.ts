import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithSmActionsListComponent } from './with-sm-actions-list.component';

describe('WithSmActionsListComponent', () => {
  let component: WithSmActionsListComponent;
  let fixture: ComponentFixture<WithSmActionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithSmActionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithSmActionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
