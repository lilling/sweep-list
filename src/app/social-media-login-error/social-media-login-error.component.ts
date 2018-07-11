import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SocialMedia } from '../../../shared/models/social-media.enum';
import { SocialMediaError } from '../../../shared/models/social-media-error.enum';
import { FacebookLoginProvider } from 'angularx-social-login';
import { LoginActions } from '../state/login/login.actions';

@Component({
    selector: 'app-social-media-login-error',
    templateUrl: 'social-media-login-error.component.html',
    styleUrls: ['social-media-login-error.component.scss']
})
export class SocialMediaLoginErrorComponent {

    SocialMedia = SocialMedia;

    constructor(public dialogRef: MatDialogRef<SocialMediaLoginErrorComponent>,
        private loginActions: LoginActions,
        @Inject(MAT_DIALOG_DATA) public data: { socialMedia: SocialMedia, status: SocialMediaError }[]) {
        this.dialogRef.disableClose = true;
    }

    getMessage(attempt: { socialMedia: SocialMedia, status: SocialMediaError }) {
        switch (attempt.status) {
            case SocialMediaError.publish:
                return `Allow posts on ${SocialMedia[attempt.socialMedia]}`;
            case SocialMediaError.authentication:
                return `Log into ${SocialMedia[attempt.socialMedia]}`;
        }
    }

    getIcon(socialMedia: SocialMedia) {
        switch (socialMedia) {
            case SocialMedia.facebook:
                return 'fa fa-facebook-f';
        }
    }

    login() {
        this.loginActions.login({ id: FacebookLoginProvider.PROVIDER_ID, fromCache: false });
        this.dialogRef.close();
    }
}
