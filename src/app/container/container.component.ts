import { Component } from '@angular/core';
//
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
//
import { AppState } from '../state/store';

@Component({
    selector: 'app-container',
    templateUrl: 'container.component.html',
    styleUrls: ['container.component.scss']
})
export class ContainerComponent {

    @select((state: AppState) => state.commonState.sideNav)
    sideNavState: Observable<boolean>;
}
