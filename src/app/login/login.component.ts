import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//
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
                private usersService: UsersService) {
        this.ngRedux.select(state => state.loginState.user).subscribe(user => {
            if (user) {
                localStorage.setItem(LocalStorageKeys.loggedUser, user.user_account_id.toString());

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
        let id = '';
        switch (candidate) {
            case SocialMedia.facebook:
                id = FacebookLoginProvider.PROVIDER_ID;
                break;
            case SocialMedia.google:
                id = GoogleLoginProvider.PROVIDER_ID;
                break;
        }

        this.loginActions.login({ id, fromCache: false });
    }

    goToList() {
        this.router.navigate(['/list']);
    }

    ngOnInit() {
        const id = localStorage.getItem(LocalStorageKeys.loggedUser);
        if (id) {
            this.loginActions.login({ id, fromCache: true });
            this.goToList();
        }
    }
}
