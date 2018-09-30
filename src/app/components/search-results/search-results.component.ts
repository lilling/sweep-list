import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//
import { NgRedux } from '@angular-redux/store';
//
import { SweepsActions } from '../../state/sweeps/sweeps.actions';
import { Subscriber } from '../../classes/subscriber';
import { AppState } from '../../state/store';
import { SweepsMode } from '../../state/sweeps/sweeps.state';
import { user_account } from '../../../../shared/classes';

@Component({
    selector: 'app-search-results',
    templateUrl: 'search-results.component.html',
    styleUrls: ['search-results.component.scss']
})
export class SearchResultsComponent extends Subscriber implements OnInit {

    mode: SweepsMode;
    user: user_account;

    constructor(private ngRedux: NgRedux<AppState>,
                private route: ActivatedRoute,
                private sweepsActions: SweepsActions) {
        super();
        this.subscriptions = {
            sweepsMode: this.ngRedux.select(state => state.sweepsState.mode).subscribe(mode => this.mode = mode),
            user: this.ngRedux.select(state => state.loginState.user).subscribe(user => this.user = user)
        };
    }

    ngOnInit() {
        this.sweepsActions.getSweeps({
            nameSearch: this.route.snapshot.params.searchString,
            user_account_id: this.user.user_account_id,
            enabled_social_media_bitmap: this.user.enabled_social_media_bitmap
        }, this.mode);
    }

}
