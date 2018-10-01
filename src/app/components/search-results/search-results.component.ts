import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
//
import { SweepsActions } from '../../state/sweeps/sweeps.actions';
import { Subscriber } from '../../classes/subscriber';
import { AppState } from '../../state/store';
import { SweepsMode } from '../../state/sweeps/sweeps.state';
import { user_sweep, user_account } from '../../../../shared/classes';

@Component({
    selector: 'app-search-results',
    templateUrl: 'search-results.component.html',
    styleUrls: ['search-results.component.scss']
})
export class SearchResultsComponent extends Subscriber {

    mode: SweepsMode;
    SweepsMode = SweepsMode;
    sweeps: {
        data: user_sweep,
        text: string
    }[];
    user: user_account;

    @select((state: AppState) => state.sweepsState.isSweepsLoading) isSweepsLoading$: Observable<boolean>;

    constructor(private ngRedux: NgRedux<AppState>,
                private route: ActivatedRoute,
                private sweepsActions: SweepsActions) {
        super();
        this.mode = +this.route.snapshot.params.mode;


        this.subscriptions = {
            params: this.route.params.subscribe(params => {
                if (this.user) {
                    this.sweepsActions.updateFilter({
                        nameSearch: params.searchString,
                        user_account_id: this.user.user_account_id,
                        enabled_social_media_bitmap: this.user.enabled_social_media_bitmap
                    }, this.mode);
                }
            }),
            user: this.ngRedux.select(state => state.loginState.user).subscribe(user => {
                this.user = user;
                if (user) {
                    this.sweepsActions.updateFilter({
                        nameSearch: this.route.snapshot.params.searchString,
                        user_account_id: user.user_account_id,
                        enabled_social_media_bitmap: user.enabled_social_media_bitmap
                    }, this.mode);
                }
            }),
            sweeps: this.ngRedux.select(state => state.sweepsState.sweeps).subscribe(sweeps => {
                if (sweeps) {
                    this.sweeps = sweeps.array.reduce((result, current) => {
                        result.push({
                            data: current,
                            text: `${this.getTimeToEnd(new Date(current.end_date).getTime())}`
                        });
                        return result;
                    }, []);
                }
            })
        };
    }

    private getTimeToEnd(endDate: number): string {
        const diff = endDate - Date.now();
        let returnValue = '';
        const days = diff / 864e5;

        if (days > 1) {
            returnValue = `${days.toFixed(0)} days`;
        } else {
            const hours = diff / 36e5;
            if (hours > 1) {
                returnValue = `${hours.toFixed(0)} hours`;
            } else {
                const minutes = diff / 6e4;

                returnValue = `${minutes.toFixed(0)} minutes`;
            }
        }

        return `${returnValue} left`;
    }
}
