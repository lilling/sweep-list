import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndedListComponent } from './ended-list.component';

describe('EndedListComponent', () => {
  let component: EndedListComponent;
  let fixture: ComponentFixture<EndedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
