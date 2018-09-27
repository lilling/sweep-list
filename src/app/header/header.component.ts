import { Component, Input } from '@angular/core';
//
import { NgRedux } from '@angular-redux/store';
//
import { CommonActions } from '../state/common/common.actions';
import { SweepsActions } from '../state/sweeps/sweeps.actions';
import { AppState } from '../state/store';
import { Subscriber } from '../classes/subscriber';
import { user_account } from '../../../shared/classes';
import { SweepsMode } from '../state/sweeps/sweeps.state';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss']
})
export class HeaderComponent extends Subscriber {
    @Input() title: string;
    mode: SweepsMode;
    user: user_account;

    constructor(private ngRedux: NgRedux<AppState>, private commonActions: CommonActions, private sweepsActions: SweepsActions) {
        super();
        this.subscriptions = {
            sweepsMode: this.ngRedux.select(state => state.sweepsState.mode).subscribe(mode => this.mode = mode),
            user: this.ngRedux.select(state => state.loginState.user).subscribe(user => this.user = user)
        };
    }

    sendMail() {
        window.location.href = 'mailto:support@sweepimp.com';
    }

    search(nameSearch: string, isEnterKeyPressed: boolean) {
        if (isEnterKeyPressed) {
            this.sweepsActions.getSweeps({ nameSearch, user_account_id: this.user.user_account_id, enabled_social_media_bitmap: this.user.enabled_social_media_bitmap }, this.mode);
        }
    }
}
