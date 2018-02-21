import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSweepComponent } from './add-sweep.component';

describe('AddSweepComponent', () => {
  let component: AddSweepComponent;
  let fixture: ComponentFixture<AddSweepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSweepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSweepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
