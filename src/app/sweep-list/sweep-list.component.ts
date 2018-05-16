import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
//
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
//
import { AddSweepComponent } from '../add-sweep/add-sweep.component';
import { user_sweep_display, user_account } from '../../../shared/classes';
import { AppState } from '../state/store';
import { SweepsActions } from '../state/sweeps/sweeps.actions';

@Component({
    selector: 'app-sweep-list',
    templateUrl: 'sweep-list.component.html',
    styleUrls: ['sweep-list.component.scss']
})
export class SweepListComponent implements OnInit {
    @select((state: AppState) => state.sweepsState.isSweepsLoading)
    isSweepsLoading$: Observable<boolean>;

    sweeps: user_sweep_display[];
    loggedUser: user_account;
    subscriptions: {[index: string]: Subscription };

    constructor(public dialog: MatDialog,
                private sweepsActions: SweepsActions,
                private ngRedux: NgRedux<AppState>) {
    }

    ngOnInit() {

        this.subscriptions = {
            user: this.ngRedux.select(state => state.loginState.user).subscribe(user => {
                this.loggedUser = user;
                if (user) {
                    this.sweepsActions.getUserSweeps(user.user_account_id.toString());
                }
            }),
            sweeps: this.ngRedux.select(state => state.sweepsState.sweeps).subscribe(sweeps => this.sweeps = sweeps)
        };
    }

    addSweep() {
        this.dialog.open(AddSweepComponent);
    }

    openUrl(urlToOpen: string) {
        let url: string = '';
        if (!/^http[s]?:\/\//.test(urlToOpen)) {
            url += 'http://';
        }

        url += urlToOpen;
        window.open(url, '_blank');
    }
}
