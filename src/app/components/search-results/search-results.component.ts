import { Component } from '@angular/core';
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
export class SearchResultsComponent extends Subscriber {

    constructor(private ngRedux: NgRedux<AppState>,
                private route: ActivatedRoute,
                private sweepsActions: SweepsActions) {
        super();
        this.subscriptions = {
            user: this.ngRedux.select(state => state.loginState.user).subscribe(user => {
                if (user) {
                    this.sweepsActions.getSweeps({
                        nameSearch: this.route.snapshot.params.searchString,
                        user_account_id: user.user_account_id,
                        enabled_social_media_bitmap: user.enabled_social_media_bitmap
                    }, +this.route.snapshot.params.mode);
                }
            })
        };
    }
}
