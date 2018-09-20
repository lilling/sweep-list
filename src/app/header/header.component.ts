import { Component, Input } from '@angular/core';
import { CommonActions } from '../state/common/common.actions';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';


@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss']
})
export class HeaderComponent {
    @Input()
    title: string;

    constructor(iconRegistry: MatIconRegistry,
                sanitizer: DomSanitizer,
                private commonActions: CommonActions) {
        iconRegistry.addSvgIcon('calendar', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/calendar.svg'));
        iconRegistry.addSvgIcon('gift', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/gift.svg'));
        iconRegistry.addSvgIcon('win', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/win.svg'));
        iconRegistry.addSvgIcon('settings', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/settings.svg'));
        iconRegistry.addSvgIcon('feedback', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/feedback.svg'));
        iconRegistry.addSvgIcon('power', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/power.svg'));
        iconRegistry.addSvgIcon('star', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/star.svg'));
        iconRegistry.addSvgIcon('star-list', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/star-list.svg'));
    }

    toggleSideNav() {
        this.commonActions.toggleSideNav();
    }

    sendMail(){
        window.location.href = "mailto:support@sweepimp.com";
    }
}
