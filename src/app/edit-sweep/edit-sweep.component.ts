import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatIconRegistry, MatSlideToggleChange, MatExpansionPanel } from '@angular/material';
import { NgRedux } from '@angular-redux/store';
//
import { AppState } from '../state/store';
import { user_sweep } from '../../../shared/classes';
import { SocialMedia } from '../../../shared/models/social-media.enum';
import { SweepsActions } from '../state/sweeps/sweeps.actions';

@Component({
    selector: 'app-edit-sweep',
    templateUrl: 'edit-sweep.component.html',
    styleUrls: ['edit-sweep.component.scss']
})
export class EditSweepComponent implements OnInit {

    sweep: user_sweep;
    SocialMedia = SocialMedia;
    thankReferrer: boolean;
    step1Valid: boolean;
    step2Valid: boolean;
    step3Valid: boolean;
    step4Valid: boolean;

    constructor(private ngRedux: NgRedux<AppState>,
                private sweepsActions: SweepsActions,
                private router: Router,
                private route: ActivatedRoute,
                iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon('contact-us', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/contact-us.svg'));
    }

    ngOnInit() {
        const sweepId = +this.route.snapshot.params['id'];
        this.ngRedux.select(state => state.sweepsState.sweeps).subscribe(sweeps => {
            this.sweep = sweeps.getItem(sweepId);
            if (this.sweep) {
                this.thankReferrer = !!this.sweep.thanks_to;
            }
        });
    }

    changeIsFrequency(event: MatSlideToggleChange, panel: MatExpansionPanel) {
        this.sweep.is_frequency = event.checked;

        if (!event.checked) {
            panel.close();
        }
    }

    changeIsReferral(event: MatSlideToggleChange, panel: MatExpansionPanel) {
        this.sweep.is_referral = event.checked;

        if (!event.checked) {
            panel.close();
        }
    }

    changeIsThank(event: MatSlideToggleChange, panel: MatExpansionPanel) {
        this.thankReferrer = event.checked;

        if (!event.checked) {
            panel.close();
        }
    }

    canSaveSweep() {
        if (!this.step1Valid || (this.sweep.is_frequency && !this.step2Valid) ||
            (this.sweep.is_referral && !this.step3Valid) || (this.thankReferrer && !this.step4Valid)) {
            return false;
        }
        return true;
    }

    saveSweep() {
        this.sweepsActions.updateSweep(this.sweep);
        this.back();
    }

    deleteSweep() {
        this.sweepsActions.deleteSweep(this.sweep.user_sweep_id);
        this.back();
    }

    back() {
        this.router.navigate(['./list']);
    }
}
