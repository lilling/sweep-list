import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSweepDataComponent } from './basic-sweep-data.component';

describe('BasicSweepDataComponent', () => {
  let component: BasicSweepDataComponent;
  let fixture: ComponentFixture<BasicSweepDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicSweepDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicSweepDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
