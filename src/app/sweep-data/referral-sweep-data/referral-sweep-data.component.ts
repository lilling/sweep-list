import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SocialMedia } from '../../../../shared/models/social-media.enum';
import { FacebookLoginProvider, GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { LocalStorageKeys } from '../../models/local-storage-keys.enum';
import { UsersService } from '../../services/users.service';
import { SocialMediaStatus } from '../../../../shared/models/social-media-status.enum';

@Component({
    selector: 'app-referral-sweep-data',
    templateUrl: 'referral-sweep-data.component.html',
    styleUrls: ['referral-sweep-data.component.scss']
})
export class ReferralSweepDataComponent {

    userAccountId: AAGUID;
    @Input() disabled: boolean;
    @Output() personalReferMessageChange = new EventEmitter();
    @Output() referralFrequencyChange = new EventEmitter();
    @Output() referFacebookChange = new EventEmitter();
    @Output() referGoogleChange = new EventEmitter();
    @Output() isValidChange = new EventEmitter<boolean>();
    SocialMedia = SocialMedia;
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
        this.userAccountId = localStorage.getItem(LocalStorageKeys.loggedUser);
    }

    private changeIsValid() {
        this.isValidChange.emit((this.facebook || this.google) && this.frequency > 0);
    }
}
