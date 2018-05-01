import { Injectable } from '@angular/core';
//
import { NgRedux } from '@angular-redux/store';
//
import { AppState } from '../../store';

@Injectable()
export class ErrorActions {

    static ERROR_OCCURED = 'ERROR_OCCURED';
    static CLEAR_ERROR = 'CLEAR_ERROR';

    constructor(private ngRedux: NgRedux<AppState>) {}

    clearError(errPath: string) {
        this.ngRedux.dispatch({ type: ErrorActions.CLEAR_ERROR, payload: errPath });
    }
}
