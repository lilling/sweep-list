import { Component, Input, EventEmitter, Output } from '@angular/core';
//
import { EnumValues } from 'enum-values';
import { ShareButtons } from '@ngx-share/core';
//
import { user_sweep } from '../../../shared/classes';
import { SocialMedia } from '../../../shared/models/social-media.enum';

@Component({
    selector: 'app-sweep-actions',
    templateUrl: 'sweep-actions.component.html',
    styleUrls: ['sweep-actions.component.scss']
})
export class SweepActionsComponent {
    @Input() smBitmap: number;
    @Input() sweep: user_sweep;
    @Output() sweepEntered = new EventEmitter();
    @Output() sweepShared = new EventEmitter<SocialMedia>();
    SocialMedia = SocialMedia;
    EnumValues = EnumValues;
    currentDate: Date;

    constructor(public share: ShareButtons) {
        this.currentDate = new Date();
    }

    isVisitUrlEnabled() {
        return this.sweep.is_frequency &&
            (!this.sweep.last_entry_date || this.sweep.last_entry_date.toDateString() !== this.currentDate.toDateString());
    }

    openUrl(urlToOpen: string) {
        this.sweepEntered.emit();
        let url = '';
        if (!/^http[s]?:\/\//.test(urlToOpen)) {
            url += 'http://';
        }

        url += urlToOpen;
        window.open(url, '_blank');
    }

    shareSweep(SM: SocialMedia) {
        this.sweepShared.emit(SM);
    }

    getUserSocialMediaEnabled(SM: SocialMedia): boolean {
        let smLastVisit: Date;
        // this.currentTime
        switch (SM) {
            case SocialMedia.Linkedin: {
                smLastVisit = this.sweep.last_linkedin_share;
                break;
            }
            case SocialMedia.Twitter: {
                smLastVisit = this.sweep.last_twitter_share;
                break;
            }
            case SocialMedia.Pinterest: {
                smLastVisit = this.sweep.last_pinterest_share;
                break;
            }
            case SocialMedia.Google: {
                smLastVisit = this.sweep.last_google_share;
                break;
            }
            case SocialMedia.Facebook: {
                smLastVisit = this.sweep.last_facebook_share;
                break;
            }
        }
        return !!(this.smBitmap & SM) && !smLastVisit || smLastVisit.toDateString() !== this.currentDate.toDateString();
    }
}
