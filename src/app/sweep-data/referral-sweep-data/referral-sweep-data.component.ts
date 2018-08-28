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
    @Output() referralFrequencyChange = new EventEmitter();
    @Output() isValidChange = new EventEmitter<boolean>();
    SocialMedia = SocialMedia;
    private frequency: number;

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
        this.isValidChange.emit(this.frequency > 0);
    }
}
