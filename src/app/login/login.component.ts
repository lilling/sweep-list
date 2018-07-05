import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
//
import { SocialMedia } from '../../../shared/models/social-media.enum';
import { UsersService } from '../services/users.service';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { LoginActions } from '../state/login/login.actions';
import { AppState } from '../state/store';
import { NgRedux } from '@angular-redux/store';
import { MatDialog } from '@angular/material';
import { DeleteAccountComponent } from '../delete-account/delete-account.component';

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
    SocialMedia = SocialMedia;
    socialMediaSelected: SocialMedia;
    userId: number;

    constructor(private authService: AuthService,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                private ngRedux: NgRedux<AppState>,
                private router: Router,
                private userService: UsersService,
                private loginActions: LoginActions) {
        this.ngRedux.select(state => state.loginState.user).subscribe(user => {
            if (user) {
                localStorage.setItem(LocalStorageKeys.loggedUser, user.user_account_id.toString());
                this.userId = user.user_account_id;
                switch (this.socialMediaSelected) {
                    case SocialMedia.facebook:
                        this.facebook = true;
                        break;
                }
            }
        });
    }

    logoff() {
        this.loginActions.logOff();
        localStorage.clear();
        this.facebook = false;
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
        this.router.navigate(['/todo', 1]);
    }

    ngOnInit() {
        if (!+this.activatedRoute.snapshot.queryParams['dt']) {
            this.userId = +localStorage.getItem(LocalStorageKeys.loggedUser);
            if (this.userId) {
                this.goToList();
            }
        }
    }

    deleteAccount() {
        this.dialog.open(DeleteAccountComponent);
    }
}
