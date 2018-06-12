import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
//
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
//
import { AddSweepComponent } from '../add-sweep/add-sweep.component';
import { user_sweep, user_account } from '../../../shared/classes';
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

    sweeps: {
        data: user_sweep,
        text: string
    }[];
    loggedUser: user_account;
    subscriptions: { [index: string]: Subscription };
    Date = Date;

    constructor(public dialog: MatDialog,
                private router: Router,
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
            sweeps: this.ngRedux.select(state => state.sweepsState.sweeps).subscribe(sweeps => {
                this.sweeps = sweeps.array.reduce((result, current) => {
                    const element = {
                        data: current,
                        text: `${this.getTimeToEnd(new Date(current.end_date).getTime())}`
                    };
                    result.push(element);
                    return result;
                }, []);
            })
        };
        this.addScrollEventHandler();
    }

    addSweep() {
        this.dialog.open(AddSweepComponent);
    }

    editSweep(sweep: user_sweep, event) {
        event.stopPropagation();
        this.router.navigate(['edit', sweep.user_sweep_id]);
    }

    openUrl(urlToOpen: string, sweepId: number) {
        this.sweepsActions.enterSweep(sweepId);
        let url: string = '';
        if (!/^http[s]?:\/\//.test(urlToOpen)) {
            url += 'http://';
        }

        url += urlToOpen;
        window.open(url, '_blank');
    }

    getTimePassedUntilLastVisit(lastVisit: Date) {
        const days = (Date.now() - lastVisit.getTime()) / 864e5;
        return `Last visit was ${days > 1 ? `${days} days ago` : `today`}`;
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

                if (minutes > 1) {
                    returnValue = `${minutes.toFixed(0)} minutes`;
                } else {
                    const seconds = diff / 1e3;

                    if (seconds > 1) {
                        returnValue = `${seconds.toFixed(0)} seconds`;
                    } else {
                        return '';
                    }
                }
            }
        }

        return `${returnValue} left`;
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
                    this.sweepsActions.getUserSweeps(this.loggedUser.user_account_id.toString(), this.sweeps[this.sweeps.length - 1].data);
                }
                lastScroll = currentScroll;
            };
        }
    }
}
