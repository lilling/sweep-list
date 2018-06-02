import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SocialMedia } from '../../../../shared/models/social-media.enum';

@Component({
    selector: 'app-thank-sweep-data',
    templateUrl: 'thank-sweep-data.component.html',
    styleUrls: ['thank-sweep-data.component.scss']
})
export class ThankSweepDataComponent {

    @Input() disabled: boolean;
    @Output() thanksSocialMediaIdChange = new EventEmitter();
    @Output() thankToChange = new EventEmitter();
    SocialMedia = SocialMedia;
    socialMedias = [SocialMedia.google, SocialMedia.facebook];
    private thanks_To: string;
    private selectedSocialMedia: number;

    @Input() get thanksTo() {
        return this.thanks_To;
    }

    set thanksTo(val: string) {
        this.thanks_To = val;
        this.thankToChange.emit(this.thanks_To);
    }

    @Input() get thanksSocialMediaId() {
        return this.selectedSocialMedia;
    }

    set thanksSocialMediaId(val: number) {
        this.selectedSocialMedia = val;
        this.thanksSocialMediaIdChange.emit(this.selectedSocialMedia);
    }
}
