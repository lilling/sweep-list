import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
//
import { MatIconRegistry } from '@angular/material';
import { NgRedux } from '@angular-redux/store';
//
import { AppState } from '../state/store';

@Component({
    selector: 'app-edit-sweep',
    templateUrl: 'edit-sweep.component.html',
    styleUrls: ['edit-sweep.component.scss']
})
export class EditSweepComponent implements OnInit {

    sweep: any;
    constructor(private ngRedux: NgRedux<AppState>,
                private router: Router,
                iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'contact-us',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/contact-us.svg'));
    }

    ngOnInit() {
        // this.ngRedux.select(state => state.sweepsState.sweeps.filter())
    }

    back() {
        this.router.navigate(['./list']);
    }

}
