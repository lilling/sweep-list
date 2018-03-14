import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//
import { LocalStorageService } from 'angular-2-local-storage';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
//
import { SocialMedia } from '../models/social-media.enum';
import { UsersService } from '../services/users.service';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';

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

    constructor(private authService: AuthService,
                private router: Router,
                private usersService: UsersService,
                private localStorageService: LocalStorageService) {
    }

    login(candidate: SocialMedia) {
        switch (candidate) {
            case SocialMedia.facebook:
                this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(data => {
                    this.usersService.login({ ...data, user_account_id: undefined }).subscribe(inner => {
                        this.facebook = true;
                        this.localStorageService.set(LocalStorageKeys.loggedUser, inner.user_account_id);
                    });
                });
                break;
            case SocialMedia.google:
                this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
                    this.usersService.login({ ...data, user_account_id: undefined }).subscribe(inner => {
                        this.google = true;
                        this.localStorageService.set(LocalStorageKeys.loggedUser, inner.user_account_id);
                    });
                });
                break;
        }
    }

    goToList() {
        this.router.navigate(['/list']);
    }

    ngOnInit() {
        const cachedUserId = this.localStorageService.get(LocalStorageKeys.loggedUser);

        if (cachedUserId) {
            this.goToList();
        }
    }
}
