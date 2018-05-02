import { Injectable } from '@angular/core';
//
import { ActionsObservable } from 'redux-observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
//
import { TypedAction } from '../models/typed-action';
import { BaseEpic } from '../models/base-epic';
import { Epic } from '../models/epic.decorator';
import { LoginActions } from './login.actions';
import { UsersService } from '../../services/users.service';
import { AuthService } from 'angularx-social-login';
import { generateError } from '../models/error';

@Injectable()
export class LoginEpics extends BaseEpic {

    constructor(private authService: AuthService, private usersService: UsersService) {
        super();
    }

    @Epic
    login(action$: ActionsObservable<TypedAction<string>>) {
        return action$.ofType(LoginActions.LOGIN)
            .switchMap(action => {
                return fromPromise(this.authService.signIn(action.payload))
                    .switchMap(user => {
                        const userAccount = { ...user, user_account_id: undefined, expiration_date: undefined, auth_error: undefined };
                        return this.usersService.login(userAccount).pipe(
                            map(res => {
                                return { type: LoginActions.LOGIN_COMPLETED, payload: res };
                            }),
                            catchError(err => {
                                return of(generateError(err, LoginActions.LOGIN_COMPLETED));
                            }));
                    });
            });
        // return this.usersService.login({ ...user, user_account_id: undefined, expiration_date: undefined, auth_error: undefined })
        //     .map(res => {
        //         return { type: LoginActions.LOGIN_COMPLETED, payload: res };
        //     })
        //     .catch(err => of(generateError(err, LoginActions.LOGIN_COMPLETED)));
    }
}
