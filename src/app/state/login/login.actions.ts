import { Injectable } from '@angular/core';
//
import { NgRedux } from '@angular-redux/store/lib/src';
import { SocialUser } from 'angularx-social-login';
//
import { AppState } from '../store';
import { ExtandedSocialUser } from '../../../../shared/classes/SocialUserAndAccount';
import { user_account } from '../../../../shared/classes';

@Injectable()
export class LoginActions {

    static LOGIN = 'LOGIN';
    static LOGIN_COMPLETED = 'LOGIN_COMPLETED';
    static LOGOFF = 'LOGOFF';
    static LOGOFF_COMPLETED = 'LOGOFF_COMPLETED';
    static DELETE_ACCOUNT = 'DELETE_ACCOUNT';
    static DELETE_ACCOUNT_COMPLETED = 'DELETE_ACCOUNT_COMPLETED';
    static UPDATE_USER = 'UPDATE_USER';
    static UPDATE_USER_COMPLETED = 'UPDATE_USER_COMPLETED';

    constructor(private ngRedux: NgRedux<AppState>) {
    }

    login(options: { id?: string, regular?: { email: string, password: string, name: string }, user?: SocialUser, fromCache: boolean }) {
        const user: ExtandedSocialUser =
            <ExtandedSocialUser>(options.user ? { ...options.user, isSocial: true } : { ...options.regular, isSocial: false });
        this.ngRedux.dispatch({ type: LoginActions.LOGIN, payload: { id: options.id, user, fromCache: options.fromCache } });
    }

    logOff() {
        this.ngRedux.dispatch({ type: LoginActions.LOGOFF });
    }

    deleteAccount(userId: AAGUID) {
        this.ngRedux.dispatch({ type: LoginActions.DELETE_ACCOUNT, payload: userId });
    }

    updateUser(user: user_account) {
        this.ngRedux.dispatch({ type: LoginActions.UPDATE_USER, payload: user });
    }
}
