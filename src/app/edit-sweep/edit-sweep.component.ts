import { Component, Inject, OnInit } from '@angular/core';
//
import { MatDialogRef, MAT_DIALOG_DATA, MatIconRegistry } from '@angular/material';
//
import { UsersService } from '../services/users.service';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { SocialMedia } from '../../../shared/models/social-media.enum';
import { FacebookLoginProvider, GoogleLoginProvider, AuthService } from 'angularx-social-login';
import { user_sweep } from '../../../shared/classes';
import { SweepsActions } from '../state/sweeps/sweeps.actions';
import { AppState } from '../state/store';
import { NgRedux } from '@angular-redux/store';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-edit-sweep',
    templateUrl: 'edit-sweep.component.html',
    styleUrls: ['edit-sweep.component.scss']
})
export class EditSweepComponent implements OnInit {

    sweep: any;
    constructor(private ngRedux: NgRedux<AppState>, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'contact-us',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/contact-us.svg'));
    }

    ngOnInit() {
        // this.ngRedux.select(state => state.sweepsState.sweeps.filter())
    }

}
