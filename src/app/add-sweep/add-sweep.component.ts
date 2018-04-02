import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsersService } from '../services/users.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { SocialMedia } from '../../../shared/models/social-media.enum';
import { FacebookLoginProvider, GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { social_media } from '../../../shared/classes';

@Component({
    selector: 'app-add-sweep',
    templateUrl: 'add-sweep.component.html',
    styleUrls: ['add-sweep.component.scss']
})
export class AddSweepComponent {
    newSweep: {
        endDate?: Date,
        name?: string,
        url?: string,
        recurringDuration?: number,
        isRecurring?: boolean,
        isShare?: boolean,
        shareDuration?: number,
        messageWithPost?: string
    };
    step: number;
    SocialMedia = SocialMedia;
    loggedSocialMedias: SocialMedia[];

    constructor(public dialogRef: MatDialogRef<AddSweepComponent>,
                private usersService: UsersService,
                private authService: AuthService,
                private localStorageService: LocalStorageService,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.clear();
        const userId = this.localStorageService.get<number>(LocalStorageKeys.loggedUser);
        this.usersService.getUserSocialAccounts(userId).subscribe(data => {
           this.loggedSocialMedias = data;
        });
    }

    next() {
        ++this.step;
    }

    back() {
        --this.step;
    }

    clear() {
        this.step = 1;
        this.newSweep = {
            isRecurring: true,
            isShare: true
        };
    }

    addSweep() {
        console.log(this.newSweep);
        this.next();
    }

    isNextDisabled() {
        switch (this.step) {
            case 1:
                return !this.newSweep.endDate || !this.newSweep.name;
            case 2:
                return this.newSweep.isRecurring && (!this.newSweep.recurringDuration || !this.newSweep.url || this.newSweep.recurringDuration < 0);
            case 3:
                return this.newSweep.isShare && (!this.newSweep.shareDuration || !this.newSweep.url || this.newSweep.shareDuration < 0);
        }
    }

    login(candidate: SocialMedia) {
        switch (candidate) {
            case SocialMedia.facebook:
                this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(data => {
                    this.usersService.login({ ...data, user_account_id: undefined, expiration_date: undefined, auth_error: undefined })
                        .subscribe(() => {
                            this.loggedSocialMedias.push(SocialMedia.facebook);
                        });
                });
                break;
            case SocialMedia.google:
                this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data => {
                    this.usersService.login({ ...data, user_account_id: undefined, expiration_date: undefined, auth_error: undefined })
                        .subscribe(inner => {
                            this.loggedSocialMedias.push(SocialMedia.google);
                        });
                });
                break;
        }
    }
}
