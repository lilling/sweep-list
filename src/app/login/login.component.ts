import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//
import { LocalStorageService } from 'angular-2-local-storage';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
//
import { SocialMedia } from '../../../shared/models/social-media.enum';
import { UsersService } from '../services/users.service';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { LoginActions } from '../state/login/login.actions';
import { AppState } from '../state/store';
import { NgRedux } from '@angular-redux/store';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {

    facebook: boolean;
    linkedin: boolean;
    pinterest: boolean;
    twitter: boolean;
    google: boolean;
    SocialMedia = SocialMedia;
    socialMediaSelected: SocialMedia;

    constructor(private authService: AuthService,
                private ngRedux: NgRedux<AppState>,
                private router: Router,
                private loginActions: LoginActions,
                private usersService: UsersService,
                private localStorageService: LocalStorageService) {
        this.ngRedux.select(state => state.loginState.user).subscribe(user => {
            if (user) {
                this.localStorageService.set(LocalStorageKeys.loggedUser, user.user_account_id);

                switch (this.socialMediaSelected) {
                    case SocialMedia.facebook:
                        this.facebook = true;
                        break;
                    case SocialMedia.google:
                        this.google = true;
                        break;
                }
            }
        });
    }

    login(candidate: SocialMedia) {
        this.socialMediaSelected = candidate;
        switch (candidate) {
            case SocialMedia.facebook:
                this.loginActions.login(FacebookLoginProvider.PROVIDER_ID);
                // this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(data => {
                //     this.usersService.login({ ...data, user_account_id: undefined, expiration_date: undefined, auth_error: undefined })
                //         .subscribe(inner => {
                //             this.facebook = true;
                //             this.localStorageService.set(LocalStorageKeys.loggedUser, inner.user_account_id);
                //         });
                // });
                break;
            case SocialMedia.google:
                this.loginActions.login(GoogleLoginProvider.PROVIDER_ID);
                // this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
                //     this.usersService.login({ ...data, user_account_id: undefined, expiration_date: undefined, auth_error: undefined })
                //         .subscribe(inner => {
                //             this.google = true;
                //             this.localStorageService.set(LocalStorageKeys.loggedUser, inner.user_account_id);
                //         });
                // });
                break;
        }
    }

    goToList() {
        this.router.navigate(['/list']);
    }

    ngOnInit() {
        if (this.localStorageService.get(LocalStorageKeys.loggedUser)) {
            this.goToList();
        }
    }
}
