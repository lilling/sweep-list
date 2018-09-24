import { Injectable } from '@angular/core';
//
import { NgRedux } from '@angular-redux/store/lib/src';
//
import { AppState } from '../store';

@Injectable()
export class CommonActions {
    static TOGGLE_SIDE_NAV = 'TOGGLE_SIDE_NAV';
    static ROUTE_CHANGED = 'ROUTE_CHANGED';

    constructor(private ngRedux: NgRedux<AppState>) {
    }

    toggleSideNav() {
        this.ngRedux.dispatch({ type: CommonActions.TOGGLE_SIDE_NAV });
    }

    routeChanged(url: string) {
        this.ngRedux.dispatch({ type: CommonActions.ROUTE_CHANGED, payload: url });
    }
}
