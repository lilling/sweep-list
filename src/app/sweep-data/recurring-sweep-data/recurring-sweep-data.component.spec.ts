import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringSweepDataComponent } from './recurring-sweep-data.component';

describe('RecurringSweepDataComponent', () => {
  let component: RecurringSweepDataComponent;
  let fixture: ComponentFixture<RecurringSweepDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringSweepDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringSweepDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
