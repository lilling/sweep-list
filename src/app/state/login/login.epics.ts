import { Injectable } from '@angular/core';
//
import { ActionsObservable } from 'redux-observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { AuthService, SocialUser } from 'angularx-social-login';
//
import { TypedAction } from '../models/typed-action';
import { BaseEpic } from '../models/base-epic';
import { Epic } from '../models/epic.decorator';
import { LoginActions } from './login.actions';
import { UsersService } from '../../services/users.service';
import { generateError } from '../models/error';
import { LocalStorageKeys } from '../../models/local-storage-keys.enum';

@Injectable()
export class LoginEpics extends BaseEpic {

    constructor(private authService: AuthService, private usersService: UsersService) {
        super();
    }

    @Epic
    login(action$: ActionsObservable<TypedAction<{id?: string, regular?: {email: string, password: string}, user?: SocialUser, fromCache: boolean}>>) {
        return action$.ofType(LoginActions.LOGIN)
            .switchMap(action => {
                if (action.payload.fromCache) {
                    return this.usersService.getUser(action.payload.id).pipe(
                        map(res => {
                            res.created = new Date(res.created);
                            res.updated = new Date(res.updated);
                            res.user_account_id = res.user_account_id;
                            return { type: LoginActions.LOGIN_COMPLETED, payload: res };
                        }),
                        catchError(err => {
                            return of(generateError(err, LoginActions.LOGIN_COMPLETED));
                        }));
                }
                
                const userAccount = { ...action.payload.user, user_account_id: undefined, expiration_date: undefined, auth_error: undefined };
                return this.usersService.login({userAccount, regular: action.payload.regular}).pipe(
                    map(res => {
                        res.created = new Date(res.created);
                        res.updated = new Date(res.updated);
                        res.user_account_id = res.user_account_id;
                        return { type: LoginActions.LOGIN_COMPLETED, payload: res };
                    }),
                    catchError(err => {
                        return of(generateError(err, LoginActions.LOGIN));
                    }));
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