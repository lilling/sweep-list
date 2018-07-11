import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//
import { AuthService, FacebookLoginProvider } from 'angularx-social-login';
import { MatDialog } from '@angular/material';
import { NgRedux } from '@angular-redux/store';
//
import { UsersService } from '../services/users.service';
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
    facebook: boolean;

    constructor(private authService: AuthService,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                private ngRedux: NgRedux<AppState>,
                private router: Router,
                private userService: UsersService,
                private loginActions: LoginActions) {
        this.ngRedux.select(state => state.loginState.user).subscribe(user => {
            this.user = user;
            if (user) {
                localStorage.setItem(LocalStorageKeys.loggedUser, user.user_account_id.toString());
                this.facebook = user.allSocialMedias.indexOf(SocialMedia.facebook) !== -1 &&
                    user.unlinkedSocialMedias.findIndex(unlinked => unlinked.socialMedia === SocialMedia.facebook) === -1;
            } else {
                this.facebook = false;
            }
        });
    }

    logoff() {
        this.loginActions.logOff();
        localStorage.clear();
    }

    login() {
        this.loginActions.login({ id: FacebookLoginProvider.PROVIDER_ID, fromCache: false });
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
