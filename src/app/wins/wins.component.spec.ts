import { TestBed, async } from '@angular/core/testing';

import { WinsComponent } from './wins.component';

describe('SweepListComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          WinsComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(WinsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
