import { Component, Input } from '@angular/core';
import { CommonActions } from '../state/common/common.actions';

@Component({
    selector: 'app-header',
    styleUrls: ['header.component.scss'],
    templateUrl: 'header.component.html'
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
