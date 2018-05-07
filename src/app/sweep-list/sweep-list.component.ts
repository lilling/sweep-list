import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
//
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
//
import { AddSweepComponent } from '../add-sweep/add-sweep.component';
import { user_sweep_display } from '../../../shared/classes';
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

    @select((state: AppState) => state.sweepsState.sweeps)
    sweeps$: Observable<user_sweep_display[]>;

    constructor(public dialog: MatDialog,
                private sweepsActions: SweepsActions,
                private ngRedux: NgRedux<AppState>) {
    }

    ngOnInit() {
        this.ngRedux.select(state => state.loginState.user).subscribe(user => {
            if (user) {
                this.sweepsActions.getUserSweeps(user.user_account_id.toString());
            }
        });
    }

    addSweep() {
        this.dialog.open(AddSweepComponent);
    }
}
