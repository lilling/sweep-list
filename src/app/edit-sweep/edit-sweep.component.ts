import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
//
import { MatIconRegistry, MatSlideToggleChange, MatExpansionPanel } from '@angular/material';
import { NgRedux } from '@angular-redux/store';
//
import { AppState } from '../state/store';
import { user_sweep_display } from '../../../shared/classes';

@Component({
    selector: 'app-edit-sweep',
    templateUrl: 'edit-sweep.component.html',
    styleUrls: ['edit-sweep.component.scss']
})
export class EditSweepComponent implements OnInit {

    sweep: user_sweep_display;

    constructor(private ngRedux: NgRedux<AppState>,
                private router: Router,
                private route: ActivatedRoute,
                iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'contact-us',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/contact-us.svg'));
    }

    ngOnInit() {
        const sweepId = +this.route.snapshot.params['id'];
        this.ngRedux.select(state => state.sweepsState.sweeps).subscribe(sweeps => this.sweep = sweeps.getItem(sweepId));
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

    openCalendar(picker, calInput) {
        picker.open();
        calInput.blur();
    }

    back() {
        this.router.navigate(['./list']);
    }

}
