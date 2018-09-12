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
    @Output() sweepEnded = new EventEmitter<number>();
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
        this.fireSweepEndedIfNeeded();
        let url = '';
        if (!/^http[s]?:\/\//.test(urlToOpen)) {
            url += 'http://';
        }

        url += urlToOpen;
        window.open(url, '_blank');
    }

    shareSweep(SM: SocialMedia) {
        this.sweepShared.emit(SM);
        this.fireSweepEndedIfNeeded(SM);
    }

    fireSweepEndedIfNeeded(selectedSM?: SocialMedia) {
        if (!this.isVisitUrlEnabled() && !EnumValues.getValues<SocialMedia>(SocialMedia).filter(sm => sm !== selectedSM).some(sm => this.getUserSocialMediaEnabled(sm))) {
            this.sweepEnded.emit(this.sweep.user_sweep_id);
        }
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
