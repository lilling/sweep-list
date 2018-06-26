import { Component, OnInit } from '@angular/core';
import { AppState } from '../state/store';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  @select((state: AppState) => state.commonState.sideNav)
  sideNavState: Observable<boolean>;
  constructor(ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
  }

}
