import { Injectable } from '@angular/core';
//
import { NgRedux } from '@angular-redux/store';
//
import { AppState } from '../store';

@Injectable()
export class CommonActions {
    static TOGGLE_SIDE_NAV = 'TOGGLE_SIDE_NAV';

    constructor(private ngRedux: NgRedux<AppState>) {
    }

    toggleSideNav() {
        this.ngRedux.dispatch({ type: CommonActions.TOGGLE_SIDE_NAV });
    }
}
