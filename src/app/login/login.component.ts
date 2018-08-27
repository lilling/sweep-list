import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { MatDialog } from '@angular/material';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
//
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { LoginActions } from '../state/login/login.actions';
import { AppState } from '../state/store';
import { DeleteAccountComponent } from '../delete-account/delete-account.component';
import { SocialMedia } from '../../../shared/models/social-media.enum';
import { IClientError } from '../../../shared/classes/client-error.interface';
import { ErrorActions } from '../state/common/errors/error.actions';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
    SocialMedia = SocialMedia;
    isRegister = false;
    password: string;
    email: string;
    name: string;

    @select((state: AppState) => state.commonState.errorState.errorMap[LoginActions.LOGIN]) error$: Observable<IClientError>;

    constructor(private authService: AuthService,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                private errorActions: ErrorActions,
                private ngRedux: NgRedux<AppState>,
                private router: Router,
                private loginActions: LoginActions) {
        this.ngRedux.select(state => state.loginState.user).subscribe(user => {
            if (user) {
                localStorage.setItem(LocalStorageKeys.loggedUser, user.user_account_id);
                this.router.navigate(['/todo', 1]);
            }
        });
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

    logoff() {
        this.loginActions.logOff();
        localStorage.clear();
    }

    regularLogin(email: string, password: string, name: string) {
        this.errorActions.clearError(LoginActions.LOGIN);
        this.login({ regular: { email, password, name } });
    }

    socialLogin(socialMedia: SocialMedia) {
        let signinPromise: Promise<SocialUser>;
        switch (socialMedia) {
            case SocialMedia.Facebook:
                signinPromise = this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
                break;
            case SocialMedia.google:
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

    deleteAccount() {
        this.dialog.open(DeleteAccountComponent);
    }

    private login(model: { regular?: { email: string, password: string, name: string }, user?: SocialUser }) {
        this.loginActions.login({ ...model, fromCache: false });
    }
}
