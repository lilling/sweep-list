import { Component, Input } from '@angular/core';
//
import { NgRedux } from '@angular-redux/store';
//
import { CommonActions } from '../state/common/common.actions';
import { AppState } from '../state/store';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss']
})
export class HeaderComponent {
    @Input() title: string;
    @Input() showBackButton = false;
    @Input() showSearch = true;

    openSearch: boolean;

    constructor(private ngRedux: NgRedux<AppState>,
                private router: Router,
                private commonActions: CommonActions,
                private location: Location) {
    }

    sendMail() {
        window.location.href = 'mailto:support@sweepimp.com';
    }

    search(nameSearch: string, isEnterKeyPressed: boolean) {
        if (isEnterKeyPressed) {
            this.router.navigate(['search', nameSearch]);
        }
    }
}
