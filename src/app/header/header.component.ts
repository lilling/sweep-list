import { Component, Input } from '@angular/core';
import { CommonActions } from '../state/common/common.actions';

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
}
