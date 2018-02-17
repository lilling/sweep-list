import { TestBed, async } from '@angular/core/testing';

import { SweepListComponent } from './sweep-list.component';

describe('SweepListComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          SweepListComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(SweepListComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
