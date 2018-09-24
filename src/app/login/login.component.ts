import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { NgRedux, select } from '@angular-redux/store/lib/src';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { EnumValues } from 'enum-values';
//
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { LoginActions } from '../state/login/login.actions';
import { AppState } from '../state/store';
import { SocialMedia } from '../../../shared/models/social-media.enum';
import { IClientError } from '../../../shared/classes/client-error.interface';
import { ErrorActions } from '../state/common/errors/error.actions';
import { user_account } from '../../../shared/classes';
import { Subscriber } from '../classes/subscriber';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent extends Subscriber implements OnInit {
    SocialMedia = SocialMedia;
    EnumValues = EnumValues;
    phaseTwo: boolean;
    isRegister = false;
    password: string;
    email: string;
    name: string;
    isNewUser: boolean;
    user: user_account;
    selectedSMs = EnumValues.getValues<SocialMedia>(SocialMedia).reduce((result, current) => {
        result.set(current, true);
        return result;
    }, new Map<number, boolean>());

    @select((state: AppState) => state.commonState.errorState.errorMap[LoginActions.LOGIN]) error$: Observable<IClientError>;

    constructor(private authService: AuthService,
                private activatedRoute: ActivatedRoute,
                private errorActions: ErrorActions,
                private ngRedux: NgRedux<AppState>,
                private router: Router,
                private loginActions: LoginActions) {
        super();
        this.subscriptions = {
          user: this.ngRedux.select(state => state.loginState.user).subscribe(user => {
              if (user) {
                  this.user = user;
                  const temp = this.ngRedux.getState().loginState.isNew;
                  if (temp) {
                      this.phaseTwo = true;
                      this.isNewUser = this.ngRedux.getState().loginState.isNew;
                  } else {
                      localStorage.setItem(LocalStorageKeys.loggedUser, user.user_account_id);
                      this.router.navigate(this.isNewUser && !temp ? ['/list'] : ['/todo', 1]);
                      this.isNewUser = temp;
                  }
              }
          })
        };
    }

    isEmail(email: string) {
        return /\S+@\S+\.\S+/.test(email);
    }

    toggleRegister() {
        this.isRegister = !this.isRegister;
        this.password = '';
        this.email = '';
        this.name = '';
        this.errorActions.clearError(LoginActions.LOGIN);
    }

    regularLogin(email: string, password: string, name: string) {
        this.errorActions.clearError(LoginActions.LOGIN);
        this.login({ regular: { email, password, name } });
    }

    updateUserSms() {
        if (this.selectedSMs.size) {
            this.loginActions.updateUser({ ...this.user, enabled_social_media_bitmap: _.sum(Array.from(this.selectedSMs.keys())) });
        } else {
            this.goToList();
        }
    }

    socialLogin(socialMedia: SocialMedia) {
        let signinPromise: Promise<SocialUser>;
        switch (socialMedia) {
            case SocialMedia.Facebook:
                signinPromise = this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
                break;
            case SocialMedia.Google:
                signinPromise = this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
                break;
        }

        signinPromise.then(user => {
            this.login({ user });
        });
    }

    goToList() {
        this.router.navigate(['/todo', 1]);
    }

    ngOnInit() {
        if (!+this.activatedRoute.snapshot.queryParams['dt']) {
            if (localStorage.getItem(LocalStorageKeys.loggedUser)) {
                this.goToList();
            }
        }
    }

    private login(model: { regular?: { email: string, password: string, name: string }, user?: SocialUser }) {
        this.loginActions.login({ ...model, fromCache: false });
    }
}
