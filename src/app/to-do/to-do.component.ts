import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
//
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
//
import { SweepsService } from '../services/sweeps.service';
import { user_sweep, user_account } from '../../../shared/classes';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { SweepsActions } from '../state/sweeps/sweeps.actions';
import { SweepsMode } from '../state/sweeps/sweeps.state';
import { AppState } from '../state/store';
import { AddSweepComponent } from '../add-sweep/add-sweep.component';
import { Subscriber } from '../classes/subscriber';
import { SocialMedia } from '../../../shared/models/social-media.enum';

@Component({
    selector: 'app-to-do',
    templateUrl: 'to-do.component.html',
    styleUrls: ['to-do.component.scss']
})
export class ToDoComponent extends Subscriber implements OnInit, AfterViewInit {

    @select((state: AppState) => state.sweepsState.isSweepsLoading)
    isSweepsLoading$: Observable<boolean>;
    sweeps: {
        data: user_sweep,
        text: string
    }[];
    mode: SweepsMode;
    user: user_account;

    constructor(private ngRedux: NgRedux<AppState>,
                public dialog: MatDialog,
                public sweepsService: SweepsService,
                private activatedRoute: ActivatedRoute,
                private sweepsActions: SweepsActions,
                private router: Router) {
        super();
    }

    ngOnInit() {
        this.sweepsActions.goToSweeps(+this.activatedRoute.snapshot.params['mode']);

        this.subscriptions = {
            sweepsMode: combineLatest(this.ngRedux.select(state => state.sweepsState.mode),
                this.ngRedux.select(state => state.loginState.user)).subscribe(([mode, user]) => {
                if (mode === undefined || !user) {
                    return;
                }
                this.user = user;
                this.mode = mode;

                if (!this.ngRedux.getState().sweepsState.sweeps.length()) {
                    const search = { user_account_id: user.user_account_id, enabled_social_media_bitmap: user.enabled_social_media_bitmap };
                    this.sweepsActions.getSweeps(search, mode);
                }
            }),
            sweeps: combineLatest(this.ngRedux.select(state => state.sweepsState.mode),
                this.ngRedux.select(state => state.sweepsState.sweeps)).subscribe(([mode, sweeps]) => {
                this.sweeps = sweeps.array.reduce((result, current) => {
                    const element = {
                        data: current,
                        text: mode === 4 ? `${this.getTimeSinceEnd(new Date(current.end_date).getTime())}` : ``
                    };
                    result.push(element);
                    return result;
                }, []);
            })
        };
    }

    ngAfterViewInit() {
        this.addScrollEventHandler();
    }

    selectedIndexChanged(index: number) {
        this.sweepsActions.goToSweeps(index + 1);
        this.router.navigate([`../${index + 1}`], { relativeTo: this.activatedRoute });
    }

    private getTimeSinceEnd(endDate: number): string {
        const diff = Date.now() - endDate;
        let returnValue = '';
        const days = diff / 864e5;

        if (days > 1) {
            returnValue = `${days.toFixed(0)} days ago`;
        } else {
            const hours = diff / 36e5;
            if (hours > 1) {
                returnValue = `${hours.toFixed(0)} hours ago`;
            } else {
                const minutes = diff / 6e4;
                returnValue = minutes > 1 ? `${minutes.toFixed(0)} minutes ago` : `just now`;
            }
        }

        return `Ended ${returnValue}`;
    }

    addSweep() {
        this.dialog.open(AddSweepComponent);
    }

    private addScrollEventHandler(): void {
        const tablesBody = document.getElementsByClassName('body');

        // some times we get negative scroll position, so we don't want to trigger load more data when scrolling back up
        let lastScroll = Number.MAX_VALUE;
        Array.from(tablesBody).forEach(el => {
            if (el) {
                const divEl = <HTMLDivElement>el;
                divEl.onscroll = () => {
                    const computed = getComputedStyle(divEl);
                    const outer = divEl.offsetHeight + parseInt(computed.marginBottom, 10) + parseInt(computed.marginTop, 10);
                    const currentScroll = divEl.scrollHeight - divEl.scrollTop - outer;
                    if (currentScroll < 1 && currentScroll < lastScroll) {
                        if (this.ngRedux.getState().sweepsState.isAllSweepsLoaded) {
                            lastScroll = currentScroll;
                            return;
                        }
                        this.sweepsActions.getSweeps({
                            user_account_id: this.user.user_account_id,
                            enabled_social_media_bitmap: this.user.enabled_social_media_bitmap,
                            lastUserSweep: this.sweeps[this.sweeps.length - 1].data
                        }, this.mode);
                    }
                    lastScroll = currentScroll;
                };
            }
        });
    }
}
