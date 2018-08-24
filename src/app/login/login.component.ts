import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { MatDialog } from '@angular/material';
import { NgRedux } from '@angular-redux/store';
//
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { LoginActions } from '../state/login/login.actions';
import { AppState } from '../state/store';
import { DeleteAccountComponent } from '../delete-account/delete-account.component';
import { user_account } from '../../../shared/classes';
import { SocialMedia } from '../../../shared/models/social-media.enum';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {

    user: user_account;
    SocialMedia = SocialMedia;

    constructor(private authService: AuthService,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                private ngRedux: NgRedux<AppState>,
                private router: Router,
                private loginActions: LoginActions) {
        this.ngRedux.select(state => state.loginState.user).subscribe(user => {
            this.user = user;
            if (user) {
                localStorage.setItem(LocalStorageKeys.loggedUser, user.user_account_id);
                this.router.navigate(['/todo', 1]);
            }
        });
    }

    logoff() {
        this.loginActions.logOff();
        localStorage.clear();
    }

    private login(model: { regular?: { email: string, password: string, name: string }, user?: SocialUser }) {
        this.loginActions.login({ ...model, fromCache: false });
    }

    regularLogin(email: string, password: string, name: string) {
        this.login({regular: { email, password, name }});
    }

    socialLogin(socialMedia: SocialMedia) {
        let signinPromise: Promise<SocialUser>;
        switch (socialMedia) {
            case SocialMedia.Facebook: 
                signinPromise = this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
                break;
            case SocialMedia.google: 
                signinPromise = this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
                break;
        }

        signinPromise.then(user => {
            this.login({user});
        })
        
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
}
