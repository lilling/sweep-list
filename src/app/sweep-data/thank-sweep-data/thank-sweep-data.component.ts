import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
//
import { EnumValues } from 'enum-values';
//
import { SocialMedia } from '../../../../shared/models/social-media.enum';

@Component({
    selector: 'app-thank-sweep-data',
    templateUrl: 'thank-sweep-data.component.html',
    styleUrls: ['thank-sweep-data.component.scss']
})
export class ThankSweepDataComponent implements OnInit {

    @Input() smBitmap: number;
    @Input() disabled: boolean;
    @Output() thanksSocialMediaIdChange = new EventEmitter();
    @Output() thankToChange = new EventEmitter();
    @Output() isValidChange = new EventEmitter<boolean>();
    smList: SocialMedia[];
    SocialMedia = SocialMedia;
    private thanks_To: string;
    private selectedSocialMedia: SocialMedia;

    @Input() get thanksTo() {
        return this.thanks_To;
    }

    set thanksTo(val: string) {
        this.thanks_To = val;
        this.changeIsValid();
        this.thankToChange.emit(this.thanks_To);
    }

    @Input() get thanksSocialMediaId() {
        return this.selectedSocialMedia;
    }

    set thanksSocialMediaId(val: number) {
        this.selectedSocialMedia = val;
        this.changeIsValid();
        this.thanksSocialMediaIdChange.emit(this.selectedSocialMedia);
    }

    private changeIsValid() {
        this.isValidChange.emit(!!this.thanksTo && ![null, undefined].includes(this.thanksSocialMediaId));
    }

    ngOnInit(): void {
        this.smList = EnumValues.getValues<SocialMedia>(SocialMedia).filter(sm => this.getUserSocialMediaEnabled(sm));
        this.thanksSocialMediaId = Math.max(...this.smList);
    }

    getUserSocialMediaEnabled(SM: SocialMedia): boolean {
        return !!(this.smBitmap & SM);
    }
}
