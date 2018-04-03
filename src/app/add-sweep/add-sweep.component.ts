import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsersService } from '../services/users.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { SocialMedia } from '../../../shared/models/social-media.enum';
import { FacebookLoginProvider, GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { user_sweep } from '../../../shared/classes/DB';
import { SweepsService } from '../services/sweeps.service';

@Component({
    selector: 'app-add-sweep',
    templateUrl: 'add-sweep.component.html',
    styleUrls: ['add-sweep.component.scss']
})
export class AddSweepComponent {
    newSweep: user_sweep;
    step: number;
    thankReferrer: boolean;
    SocialMedia = SocialMedia;
    socialMedias = [SocialMedia.google, SocialMedia.facebook];
    loggedSocialMedias: SocialMedia[];
    userAccountId: number;

    constructor(public dialogRef: MatDialogRef<AddSweepComponent>,
                private usersService: UsersService,
                private sweepsService: SweepsService,
                private authService: AuthService,
                private localStorageService: LocalStorageService,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.userAccountId = this.localStorageService.get<number>(LocalStorageKeys.loggedUser);
        this.usersService.getUserSocialAccounts(this.userAccountId).subscribe(data => {
            this.loggedSocialMedias = data;
        });
        this.clear();
    }

    next() {
        ++this.step;
    }

    back() {
        --this.step;
    }

    clear() {
        this.step = 1;
        this.thankReferrer = true;
        this.newSweep = {
            user_sweep_id: null,
            user_account_id: this.userAccountId,
            sweep_id: null,
            sweep_name: null,
            sweep_url: null,
            end_date: null,
            is_frequency: true,
            frequency_url: null,
            frequency_days: null,
            is_referral: true,
            referral_url: null,
            referral_frequency: null,
            personal_refer_message: null,
            refer_facebook: null,
            refer_twitter: null,
            refer_google: null,
            refer_linkedin: null,
            refer_pinterest: null,
            thanks_to: null,
            thanks_social_media_id: null,
            won_yn: null,
            prize_value: null,
            deleted_yn: null,
            created: null,
            updated: null,
        };
    }

    addSweep() {
        console.log(this.newSweep);
        this.sweepsService.addOrUpdateSweep(this.newSweep).subscribe(data => {
            console.log(data);
            this.next();
        });
    }

    isNextDisabled() {
        switch (this.step) {
            case 1:
                return !this.newSweep.end_date || !this.newSweep.sweep_name;
            case 2:
                return this.newSweep.is_frequency && (!this.newSweep.frequency_days || !this.newSweep.frequency_url || this.newSweep.frequency_days < 0);
            case 3:
                return this.newSweep.is_referral && (!this.newSweep.referral_frequency || !this.newSweep.referral_url || this.newSweep.referral_frequency < 0 ||
                    (!this.newSweep.refer_google && !this.newSweep.refer_facebook && !this.newSweep.refer_linkedin && !this.newSweep.refer_pinterest && !this.newSweep.refer_twitter));
            case 4:
                return this.thankReferrer && (!this.newSweep.thanks_to || this.newSweep.thanks_social_media_id === undefined);
        }
    }

    login(candidate: SocialMedia) {
        if (this.loggedSocialMedias.includes(candidate)) {
            return;
        }
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
