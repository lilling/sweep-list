import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
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
            sweeps: this.ngRedux.select(state => state.sweepsState.sweeps).subscribe(sweeps => this.sweeps = sweeps)
        };


        this.addScrollEventHandler();
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
                    this.sweepsActions.getUserSweeps(this.loggedUser.user_account_id.toString(), this.sweeps[this.sweeps.length - 1]);
                }
                lastScroll = currentScroll;
            };
        }
    }

    addSweep() {
        this.dialog.open(AddSweepComponent);
    }

    editSweep(sweep: user_sweep_display, event) {
        event.stopPropagation();
        this.router.navigate(['edit', sweep.user_sweep_id]);
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
