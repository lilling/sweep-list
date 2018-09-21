import { Component, Input } from '@angular/core';
import { CommonActions } from '../state/common/common.actions';
//import { DomSanitizer } from '@angular/platform-browser';
//import { MatIconRegistry } from '@angular/material';


@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss']
})
export class HeaderComponent {
    @Input()
    title: string;

    constructor(private commonActions: CommonActions) {
    }

    toggleSideNav() {
        this.commonActions.toggleSideNav();
    }

    sendMail(){
        window.location.href = "mailto:support@sweepimp.com";
    }
}
