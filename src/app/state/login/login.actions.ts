import { Injectable } from '@angular/core';
//
import { NgRedux } from '@angular-redux/store';
//
import { AppState } from '../store';

@Injectable()
export class LoginActions {

    static LOGIN = 'LOGIN';
    static LOGIN_COMPLETED = 'LOGIN_COMPLETED';
    static LOGOFF = 'LOGOFF';
    static LOGOFF_COMPLETED = 'LOGOFF_COMPLETED';
    static DELETE_ACCOUNT = 'DELETE_ACCOUNT';
    static DELETE_ACCOUNT_COMPLETED = 'DELETE_ACCOUNT_COMPLETED';


    constructor(private ngRedux: NgRedux<AppState>) {
    }

    login(options: {id: string, fromCache: boolean}) {
        this.ngRedux.dispatch({ type: LoginActions.LOGIN, payload: options });
    }

    logOff() {
        this.ngRedux.dispatch({ type: LoginActions.LOGOFF });
    }

    deleteAccount(userId: AAGUID) {
        this.ngRedux.dispatch({ type: LoginActions.DELETE_ACCOUNT, payload: userId });
    }
}
