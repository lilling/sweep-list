import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SocialMedia } from '../../../../shared/models/social-media.enum';
import { FacebookLoginProvider, GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { LocalStorageKeys } from '../../models/local-storage-keys.enum';
import { UsersService } from '../../services/users.service';

@Component({
    selector: 'app-referral-sweep-data',
    templateUrl: 'referral-sweep-data.component.html',
    styleUrls: ['referral-sweep-data.component.scss']
})
export class ReferralSweepDataComponent {

    userAccountId: number;
    loggedSocialMedias: SocialMedia[];
    @Input() disabled: boolean;
    @Output() referralUrlChange = new EventEmitter();
    @Output() personalReferMessageChange = new EventEmitter();
    @Output() referralFrequencyChange = new EventEmitter();
    @Output() referFacebookChange = new EventEmitter();
    @Output() referGoogleChange = new EventEmitter();
    @Output() isValidChange = new EventEmitter<boolean>();
    SocialMedia = SocialMedia;
    private url: string;
    private message: string;
    private frequency: number;
    private google: boolean;
    private facebook: boolean;

    @Input() get referGoogle() {
        return this.google;
    }

    set referGoogle(val: boolean) {
        this.google = val;
        this.changeIsValid();
        this.referGoogleChange.emit(this.google);
    }

    @Input() get referFacebook() {
        return this.facebook;
    }

    set referFacebook(val: boolean) {
        this.facebook = val;
        this.changeIsValid();
        this.referFacebookChange.emit(this.facebook);
    }

    @Input() get referralUrl() {
        return this.url;
    }

    set referralUrl(val: string) {
        this.url = val;
        this.changeIsValid();
        this.referralUrlChange.emit(this.url);
    }

    @Input() get personalReferMessage() {
        return this.message;
    }

    set personalReferMessage(val: string) {
        this.message = val;
        this.changeIsValid();
        this.personalReferMessageChange.emit(this.message);
    }

    @Input() get referralFrequency() {
        return this.frequency;
    }

    set referralFrequency(val: number) {
        this.frequency = val;
        this.changeIsValid();
        this.referralFrequencyChange.emit(this.frequency);
    }

    constructor(private usersService: UsersService, private authService: AuthService) {
        this.userAccountId = +localStorage.getItem(LocalStorageKeys.loggedUser);
        this.usersService.getUserSocialAccounts(this.userAccountId).subscribe(socialMedias => {
            this.loggedSocialMedias = socialMedias;
        });
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
                        .subscribe(() => {
                            this.loggedSocialMedias.push(SocialMedia.google);
                        });
                });
                break;
        }
    }

    private changeIsValid() {
        this.isValidChange.emit((this.facebook || this.google) && this.frequency > 0 && !!this.url);
    }
}
