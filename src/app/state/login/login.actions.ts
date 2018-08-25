import { Injectable } from '@angular/core';
//
import { NgRedux } from '@angular-redux/store';
import { SocialUser } from 'angularx-social-login';
//
import { AppState } from '../store';
import { ExtandedSocialUser } from '../../../../shared/classes';

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

    login(options: {id?: string, regular?: { email: string, password: string, name: string }, user?: SocialUser, fromCache: boolean}) {
        const userConst = new ExtandedSocialUser;
        if (options.user){
            userConst.provider = options.user.provider;
            userConst.id = options.user.id;
            userConst.email = options.user.email;
            userConst.name = options.user.name;
            userConst.photoUrl = options.user.photoUrl;
            userConst.firstName = options.user.firstName;
            userConst.lastName = options.user.lastName;
            userConst.authToken = options.user.authToken;
            userConst.idToken = options.user.idToken;
            userConst.isSocial = true;
        } else if (options.regular){
            userConst.email = options.regular.email;
            userConst.password = options.regular.password;
            userConst.name = options.regular.name;
            userConst.isSocial = false;
        }
        this.ngRedux.dispatch({ type: LoginActions.LOGIN, payload: {id: options.id, user: userConst, fromCache: options.fromCache} });
    }

    logOff() {
        this.ngRedux.dispatch({ type: LoginActions.LOGOFF });
    }

    deleteAccount(userId: AAGUID) {
        this.ngRedux.dispatch({ type: LoginActions.DELETE_ACCOUNT, payload: userId });
    }
}
