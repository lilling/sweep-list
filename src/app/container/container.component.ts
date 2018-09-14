import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
//
import { MatIconRegistry } from '@angular/material';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
//
import { AppState } from '../state/store';
import { CommonActions } from '../state/common/common.actions';
import { LoginActions } from '../state/login/login.actions';

@Component({
    selector: 'app-container',
    templateUrl: 'container.component.html',
    styleUrls: ['container.component.scss']
})
export class ContainerComponent {

    @select((state: AppState) => state.commonState.sideNav)
    sideNavState: Observable<boolean>;
    sideNav: boolean;

    constructor(iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer,
                private commonActions: CommonActions,
                private loginActions: LoginActions,
                private router: Router) {
        iconRegistry.addSvgIcon('calendar-with-clock', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/calendar-with-clock.svg'));

        this.sideNavState.subscribe(sideNav => {
            this.sideNav = sideNav;
        });
    }

    toggleSideNav() {
        if (this.sideNav) {
            this.commonActions.toggleSideNav();
        }
    }

    logoff() {
        this.loginActions.logOff();
        localStorage.clear();
        location.reload();
    }
}
