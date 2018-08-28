import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//
import * as _ from 'lodash';
//
import { SweepsService } from '../services/sweeps.service';
import { user_sweep } from '../../../shared/classes';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { SweepsActions } from '../state/sweeps/sweeps.actions';
import { SweepsMode } from '../state/sweeps/sweeps.state';
import { AppState } from '../state/store';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AddSweepComponent } from '../add-sweep/add-sweep.component';
import { MatDialog } from '@angular/material';
import { $ } from 'protractor';

@Component({
    selector: 'app-to-do',
    templateUrl: 'to-do.component.html',
    styleUrls: ['to-do.component.scss']
})
export class ToDoComponent implements OnInit, AfterViewInit, OnDestroy {

    @select((state: AppState) => state.sweepsState.isSweepsLoading)
    isSweepsLoading$: Observable<boolean>;
    sweeps: user_sweep[] = [];
    subscriptions: { [index: string]: Subscription };
    mode: SweepsMode;
    userAccountId: AAGUID;
    
    socialColumns = [
        //{columnDef: 'FB', cell: (sweep: user_sweep, id: string) => this.getFacebookURL(sweep, id) },
        {columnDef: 'FB', cell: (element: Element) => `Facebook` },
        {columnDef: 'TW', cell: (element: Element) => `Twitter`  },
        {columnDef: 'GO', cell: (element: Element) => `Google`   },
        {columnDef: 'LI', cell: (element: Element) => `Linkedin` },
        {columnDef: 'PT', cell: (element: Element) => `Pinterest`}
    ];
    displayedSocialColumns = this.socialColumns.map(c => c.columnDef);

    getFacebookURL(sweep: user_sweep, id: string){
        let frag = document.createRange().createContextualFragment('<div class="fb-share-button" data-href='+sweep.sweep_url+' data-layout="button_count" data-size="large" data-mobile-iframe="true">'+
        '<a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u='+encodeURI(sweep.sweep_url)+'%2F&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">' +
        'Share</a></div>');
//console.log(id);
        let placementNode = document.getElementById(id);
//console.log(placementNode);
        //        let placementNode = document.querySelector(id);
        placementNode.appendChild(frag);
        return;
    }

    constructor(private ngRedux: NgRedux<AppState>,
                public dialog: MatDialog,
                public sweepsService: SweepsService,
                private activatedRoute: ActivatedRoute,
                private sweepsActions: SweepsActions,
                private router: Router) {
    }

    ngOnInit() {
        this.userAccountId = localStorage.getItem(LocalStorageKeys.loggedUser);
        this.sweepsActions.goToSweeps(+this.activatedRoute.snapshot.params['mode']);

        this.subscriptions = {
            sweepsMode: this.ngRedux.select(state => state.sweepsState.mode).subscribe(mode => {
                this.mode = mode;

                if (!this.ngRedux.getState().sweepsState.sweeps.length()) {
                    this.sweepsActions.getSweeps({ user_account_id: this.userAccountId }, mode);
                }
            }),
            sweeps: this.ngRedux.select(state => state.sweepsState.sweeps).subscribe(sweeps => {
                this.sweeps = sweeps.array;
            })
        };
/*console.log('this.ngRedux.getState().loginState.user.has_facebook: ', this.ngRedux.getState().loginState.user.has_facebook);
        if (this.ngRedux.getState().loginState.user.has_facebook) {this.socialColumns.push({columnDef: 'FB', cell: (element: Element) => `Facebook` })};
        if (this.ngRedux.getState().loginState.user.has_twitter)  {this.socialColumns.push({columnDef: 'TW', cell: (element: Element) => `Twitter`  })};
        if (this.ngRedux.getState().loginState.user.has_google)   {this.socialColumns.push({columnDef: 'GO', cell: (element: Element) => `Google`   })};
        if (this.ngRedux.getState().loginState.user.has_linkedin) {this.socialColumns.push({columnDef: 'LI', cell: (element: Element) => `Linkedin` })};
        if (this.ngRedux.getState().loginState.user.has_pinterest){this.socialColumns.push({columnDef: 'PT', cell: (element: Element) => `Pinterest`})};
        this.displayedSocialColumns = this.socialColumns.map(c => c.columnDef);*/
    }

    ngAfterViewInit() {
        this.addScrollEventHandler();
    }

    selectedIndexChanged(index: number) {
        this.sweepsActions.goToSweeps(index + 1);
        this.router.navigate([`../${index + 1}`], {relativeTo : this.activatedRoute});
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

    nextVisit(sweep: user_sweep) {
        const nextVisit = sweep.frequency_days * 864e5 - (Date.now() - sweep.last_entry_date.getTime());

        if (nextVisit < 0) {
            return 'You should enter right now';
        }

        let returnValue = '';

        const days = nextVisit / 864e5;

        if (days > 1) {
            returnValue = `${days.toFixed(0)} days`;
        } else {
            const hours = nextVisit / 36e5;
            if (hours > 1) {
                returnValue = `${hours.toFixed(0)} hours`;
            } else {
                const minutes = nextVisit / 6e4;

                returnValue = `${minutes.toFixed(0)} minutes`;
            }
        }

        return `${returnValue} left to next visit.`;
    }

    addSweep() {
        this.dialog.open(AddSweepComponent);
    }

    ngOnDestroy() {
        _.forOwn(this.subscriptions, subscription => subscription.unsubscribe());
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
                            user_account_id: this.userAccountId,
                            lastUserSweep: this.sweeps[this.sweeps.length - 1]
                        }, this.mode);
                    }
                    lastScroll = currentScroll;
                };
            }
        });

    }
}