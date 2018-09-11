import { Component, Input, EventEmitter, Output } from '@angular/core';
//
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
    currentDate: Date;

    constructor(public share: ShareButtons) {
        this.currentDate = new Date();
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
        if (!smLastVisit){
            return !!(this.smBitmap & SM);
        } else {
            return smLastVisit.toDateString() !== this.currentDate.toDateString();
        }
    }
}
