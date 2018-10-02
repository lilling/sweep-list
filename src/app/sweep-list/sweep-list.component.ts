import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
//
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { combineLatest } from 'rxjs/observable/combineLatest';
//
import { AddSweepComponent } from '../add-sweep/add-sweep.component';
import { user_sweep, user_account } from '../../../shared/classes';
import { AppState } from '../state/store';
import { SweepsActions } from '../state/sweeps/sweeps.actions';
import { SweepsMode } from '../state/sweeps/sweeps.state';
import { Subscriber } from '../classes/subscriber';

@Component({
    selector: 'app-sweep-list',
    templateUrl: 'sweep-list.component.html',
    styleUrls: ['sweep-list.component.scss']
})
export class SweepListComponent extends Subscriber implements OnInit {
    @select((state: AppState) => state.sweepsState.isSweepsLoading)
    isSweepsLoading$: Observable<boolean>;
    user: user_account;
    sweeps: {
        data: user_sweep,
        text: string
    }[];
    SweepsMode = SweepsMode;

    constructor(public dialog: MatDialog,
                public sweepsActions: SweepsActions,
                private ngRedux: NgRedux<AppState>) {
        super();
    }

    ngOnInit() {
        this.sweepsActions.goToSweeps(SweepsMode.active);

        this.subscriptions = {
            sweepsMode: combineLatest(this.ngRedux.select(state => state.sweepsState.mode),
                this.ngRedux.select(state => state.loginState.user)).subscribe(([mode, user]) => {
                if (mode === undefined || !user) {
                    return;
                }
                this.user = user;
                if (mode === SweepsMode.active && !this.ngRedux.getState().sweepsState.sweeps.length()) {
                    this.sweepsActions.getSweeps({
                        user_account_id: user.user_account_id,
                        enabled_social_media_bitmap: user.enabled_social_media_bitmap
                    }, mode);
                }
            }),
            sweeps: this.ngRedux.select(state => state.sweepsState.sweeps).subscribe(sweeps => {
                this.sweeps = sweeps.array.reduce((result, current) => {
                    result.push({
                        data: current,
                        text: `${this.getTimeToEnd(new Date(current.end_date).getTime())}`
                    });
                    return result;
                }, []);
            })
        };
        this.addScrollEventHandler();
    }

    addSweep() {
        this.dialog.open(AddSweepComponent);
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

    private addScrollEventHandler(): void {
        const tableBody = document.getElementsByClassName('body');
        const el = <HTMLDivElement>tableBody[0];
        // some times we get negative scroll position, so we don't want to trigger load more data when scrolling back up
        let lastScroll = Number.MAX_VALUE;
        if (el) {
            el.onscroll = () => {
                const computed = getComputedStyle(el);
                const outer = el.offsetHeight + parseInt(computed.marginBottom, 10) + parseInt(computed.marginTop, 10);
                const currentScroll = el.scrollHeight - el.scrollTop - outer;
                if (currentScroll < 1 && currentScroll < lastScroll) {
                    if (this.ngRedux.getState().sweepsState.isAllSweepsLoaded) {
                        lastScroll = currentScroll;
                        return;
                    }
                    this.sweepsActions.getSweeps({
                        user_account_id: this.user.user_account_id,
                        enabled_social_media_bitmap: this.user.enabled_social_media_bitmap,
                        lastUserSweep: this.sweeps[this.sweeps.length - 1].data
                    }, SweepsMode.active);
                }
                lastScroll = currentScroll;
            };
        }
    }
}
