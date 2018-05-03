import { Injectable } from '@angular/core';
//
import { NgRedux } from '@angular-redux/store';
//
import { AppState } from '../store';

@Injectable()
export class LoginActions {

    static LOGIN = 'LOGIN';
    static LOGIN_COMPLETED = 'LOGIN_COMPLETED';
    static LOGIN_FAILED = 'LOGIN_FAILED';

    constructor(private ngRedux: NgRedux<AppState>) {
    }

    login(options: {id: string, fromCache: boolean}) {
        this.ngRedux.dispatch({ type: LoginActions.LOGIN, payload: options });
    }
}
