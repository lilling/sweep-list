import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
//
import { FacebookLoginProvider } from 'angularx-social-login';
//
import { SocialMedia } from '../../../shared/models/social-media.enum';
import { SocialMediaStatus } from '../../../shared/models/social-media-status.enum';
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
        @Inject(MAT_DIALOG_DATA) public data: { socialMedia: SocialMedia, status: SocialMediaStatus }[]) {
        this.dialogRef.disableClose = true;
    }

    getMessage(attempt: { socialMedia: SocialMedia, status: SocialMediaStatus }) {
        switch (attempt.status) {
            case SocialMediaStatus.publishNotGranted:
                return `ALLOW POSTS ON ${SocialMedia[attempt.socialMedia].toUpperCase()}`;
            case SocialMediaStatus.authenticationError:
                return `LOG INTO ${SocialMedia[attempt.socialMedia].toUpperCase()}`;
        }
    }

    getIcon(socialMedia: SocialMedia) {
        switch (socialMedia) {
            case SocialMedia.Facebook:
                return 'fa fa-facebook-f';
        }
    }

    login() {
        this.loginActions.login({ id: FacebookLoginProvider.PROVIDER_ID, fromCache: false });
        this.dialogRef.close();
    }
}
