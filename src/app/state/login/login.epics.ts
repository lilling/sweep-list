import { Injectable } from '@angular/core';
//
import { ActionsObservable } from 'redux-observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { AuthService } from 'angularx-social-login';
//
import { TypedAction } from '../models/typed-action';
import { BaseEpic } from '../models/base-epic';
import { Epic } from '../models/epic.decorator';
import { LoginActions } from './login.actions';
import { UsersService } from '../../services/users.service';
import { generateError } from '../models/error';
import { LocalStorageKeys } from '../../models/local-storage-keys.enum';
import { ExtandedSocialUser, user_account } from '../../../../shared/classes';

@Injectable()
export class LoginEpics extends BaseEpic {

    constructor(private authService: AuthService, private usersService: UsersService) {
        super();
    }

    @Epic
    login(action$: ActionsObservable<TypedAction<{ id?: string, user?: ExtandedSocialUser, fromCache: boolean }>>) {
        return action$.ofType(LoginActions.LOGIN)
            .switchMap(action => {
                let observer;
                if (action.payload.fromCache) {
                    observer = this.usersService.getUser(action.payload.id);
                } else if (!action.payload.user.isSocial && action.payload.user.name) {
                    observer = this.usersService.register(action.payload.user);
                } else {
                    observer = this.usersService.login(action.payload.user);
                }
                return observer.pipe(
                    map(res => {
                        return { type: LoginActions.LOGIN_COMPLETED, payload: res };
                    }),
                    catchError(err => {
                        return of(generateError(err, LoginActions.LOGIN));
                    }));
            });
    }

    @Epic
    forgotMail(action$: ActionsObservable<TypedAction<string>>) {
        return action$.ofType(LoginActions.FORGOT_MAIL)
            .switchMap(action => {
                return this.usersService.
                    map(val => {
                        return { type: LoginActions.LOGOFF_COMPLETED };
                    }),
                    catchError(err => {
                        return of(generateError(err, LoginActions.LOGOFF));
                    })
                );
            });
    }

    @Epic
    logOff(action$: ActionsObservable<TypedAction<AAGUID>>) {
        return action$.ofType(LoginActions.LOGOFF)
            .switchMap(action => {
                return fromPromise(this.authService.signOut()).pipe(
                    map(val => {
                        return { type: LoginActions.LOGOFF_COMPLETED };
                    }),
                    catchError(err => {
                        return of(generateError(err, LoginActions.LOGOFF));
                    })
                );
            });
    }

    @Epic
    updateUser(action$: ActionsObservable<TypedAction<user_account>>) {
        return action$.ofType(LoginActions.UPDATE_USER)
            .switchMap(action => {
                return this.usersService.updateUser(action.payload).pipe(
                    map(val => {
                        return { type: LoginActions.UPDATE_USER_COMPLETED, payload: val};
                    }),
                    catchError(err => {
                        return of(generateError(err, LoginActions.UPDATE_USER));
                    })
                );
            });
    }

    @Epic
    deleteAccount(action$: ActionsObservable<TypedAction<AAGUID>>) {
        return action$.ofType(LoginActions.DELETE_ACCOUNT)
            .switchMap(action => {
                return fromPromise(this.authService.signOut()).switchMap(() => {
                    return this.usersService.deleteAccount(action.payload).pipe(
                        map(val => {
                            localStorage.removeItem(LocalStorageKeys.loggedUser);
                            return { type: LoginActions.DELETE_ACCOUNT_COMPLETED };
                        }),
                        catchError(err => {
                            return of(generateError(err, LoginActions.DELETE_ACCOUNT));
                        }));
                });
            });
    }
}