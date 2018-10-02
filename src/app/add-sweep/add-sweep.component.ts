import { Component, Inject } from '@angular/core';
//
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
//
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { user_sweep, user_account } from '../../../shared/classes';
import { SweepsActions } from '../state/sweeps/sweeps.actions';
import { AppState } from '../state/store';

@Component({
    selector: 'app-add-sweep',
    templateUrl: 'add-sweep.component.html',
    styleUrls: ['add-sweep.component.scss']
})
export class AddSweepComponent {

    @select((state: AppState) => state.loginState.user) user$: Observable<user_account>;
    newSweep: user_sweep;
    step: number;
    thankReferrer: boolean;
    userAccountId: AAGUID;
    step1Valid: boolean;
    step2Valid: boolean;
    step3Valid: boolean;
    step4Valid: boolean;

    constructor(public dialogRef: MatDialogRef<AddSweepComponent>,
                private sweepsActions: SweepsActions,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.userAccountId = localStorage.getItem(LocalStorageKeys.loggedUser);
        this.clear();
    }

    next() {
        if (this.step === 2 && this.newSweep.is_frequency) {
            this.newSweep.referral_url = this.newSweep.frequency_url;
        }
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
            last_facebook_share: null,
            last_twitter_share: null,
            last_google_share: null,
            last_linkedin_share: null,
            last_pinterest_share: null,
            last_entry_date: null,
            total_entries: null,
            total_shares: null,
            thanks_to: null,
            thanks_social_media_id: null,
            won_yn: null,
            prize_value: null,
            deleted_yn: null,
            thanked_yn: null,
            created: null,
            updated: null,
        };
    }

    addSweep() {
        this.sweepsActions.addSweep(this.newSweep);
        this.dialogRef.close();
    }

    isNextDisabled() {
        switch (this.step) {
            case 1:
                return !this.step1Valid;
            case 2:
                return this.newSweep.is_frequency && !this.step2Valid;
            case 3:
                return this.newSweep.is_referral && !this.step3Valid;
            case 4:
                return this.thankReferrer && !this.step4Valid;
        }
    }
}
