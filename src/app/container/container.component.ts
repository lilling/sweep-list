import { Component } from '@angular/core';
import { Router } from '@angular/router';
//
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

    constructor(private commonActions: CommonActions,
                private loginActions: LoginActions,
                private router: Router) {

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
