import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { SocialMedia } from '../models/social-media.enum';

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

    constructor(private authService: AuthService, private router: Router) {
    }

    login(candidate: SocialMedia) {
        switch (candidate) {
            case SocialMedia.facebook:
                this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(data => {
                    console.log('facebook: ', data);
                    this.facebook = true;
                });
                break;
            case SocialMedia.google:
                this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
                    console.log('google: ', data);
                    this.google = true;
                });
                break;
        }
    }

    goToList() {
        this.router.navigate(['/list']);
    }

    ngOnInit() {
    }

}
