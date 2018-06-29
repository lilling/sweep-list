import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
//
import * as _ from 'lodash';
//
import { SweepsService } from '../services/sweeps.service';
import { user_sweep, Search } from '../../../shared/classes';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { SweepsActions } from '../state/sweeps/sweeps.actions';
import { SweepsMode } from '../state/sweeps/sweeps.state';
import { AppState } from '../state/store';
import { NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-to-do',
    templateUrl: 'to-do.component.html',
    styleUrls: ['to-do.component.scss']
})
export class ToDoComponent implements OnInit, OnDestroy {
    currentSearch: Search;
    sweeps: user_sweep[] = [];
    subscriptions: { [index: string]: Subscription };

    constructor(private ngRedux: NgRedux<AppState>, private sweepsService: SweepsService, private sweepsActions: SweepsActions, private router: Router) {
    }

    ngOnInit() {
        const id = localStorage.getItem(LocalStorageKeys.loggedUser);
        this.currentSearch = {
            user_account_id: +id
        };
        this.sweepsActions.goToSweeps(SweepsMode.today);

        this.subscriptions = {
            sweepsMode: this.ngRedux.select(state => state.sweepsState.mode).subscribe(mode => {
                if (this.sweeps.length) {
                    this.currentSearch.lastUserSweep = this.sweeps[this.sweeps.length - 1];
                }
                this.sweepsActions.getSweeps(this.currentSearch, mode);
            }),
            sweeps: this.ngRedux.select(state => state.sweepsState.sweeps).subscribe(sweeps => {
                this.sweeps = sweeps.array;
            })
        };

        this.addScrollEventHandler();
    }

    selectedIndexChanged(index: number) {
        this.sweepsActions.goToSweeps(index + 1);
    }

    openUrl(urlToOpen: string, sweepId: number) {
        this.sweepsActions.enterSweep(sweepId);
        let url = '';
        if (!/^http[s]?:\/\//.test(urlToOpen)) {
            url += 'http://';
        }

        url += urlToOpen;
        window.open(url, '_blank');
    }

    editSweep(sweep: user_sweep, event) {
        event.stopPropagation();
        this.router.navigate(['edit', sweep.user_sweep_id]);
    }

    getTimePassedUntilLastVisit(lastVisit: Date) {
        if (!lastVisit) {
            return '';
        }
        const days = (Date.now() - lastVisit.getTime()) / 864e5;
        return `Last visit was ${days > 1 ? `${days.toFixed(0)} days ago` : `today`}. `;
    }

    ngOnDestroy() {
        _.forOwn(this.subscriptions, subscription => subscription.unsubscribe());
    }

    private outerHeight(element: HTMLElement): number {
        let height = element.offsetHeight;
        const computedStyle = getComputedStyle(element);

        height += parseInt(computedStyle.marginTop, 10) + parseInt(computedStyle.marginBottom, 10);
        return height;
    }

    private addScrollEventHandler(): void {
        const tableBody = document.getElementsByClassName('body');
        const el = <HTMLDivElement>tableBody[0];
        // some times we get negative scroll position, so we don't want to trigger load more data when scrolling back up
        let lastScroll = Number.MAX_VALUE;
        if (el) {
            el.onscroll = () => {
                const currentScroll = el.scrollHeight - el.scrollTop - this.outerHeight(el);
                if (currentScroll < 1 && currentScroll < lastScroll) {
                    if (this.ngRedux.getState().sweepsState.isAllSweepsLoaded) {
                        lastScroll = currentScroll;
                        return;
                    }
                    this.sweepsActions.getSweeps({
                        user_account_id: this.loggedUser.user_account_id,
                        lastUserSweep: this.sweeps[this.sweeps.length - 1].data
                    }, SweepsMode.active);
                }
                lastScroll = currentScroll;
            };
        }
    }
}