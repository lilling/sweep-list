import { Component, OnInit } from '@angular/core';
//
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
//
import { AddSweepComponent } from '../add-sweep/add-sweep.component';
import { user_sweep } from '../../../shared/classes';
import { AppState } from '../state/store';
import { SweepsActions } from '../state/sweeps/sweeps.actions';
import { SweepsMode } from '../state/sweeps/sweeps.state';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { SweepsService } from '../services/sweeps.service';

@Component({
    selector: 'app-ended-list',
    templateUrl: 'ended-list.component.html',
    styleUrls: ['ended-list.component.scss']
})
export class EndedListComponent implements OnInit {
    sweeps: user_sweep[];
    userAccountId: number;

    constructor(private sweepsService: SweepsService, private sweepsActions: SweepsActions) {
    }

     ngOnInit() {
    //     this.userAccountId = +localStorage.getItem(LocalStorageKeys.loggedUser);
    //     this.addScrollEventHandler();
     }
    //
    // editSweep(sweep: user_sweep, event) {
    //     event.stopPropagation();
    //     this.router.navigate(['edit', sweep.user_sweep_id]);
    // }
    //
    // openUrl(urlToOpen: string, sweepId: number) {
    //     this.sweepsActions.enterSweep(sweepId);
    //     let url = '';
    //     if (!/^http[s]?:\/\//.test(urlToOpen)) {
    //         url += 'http://';
    //     }
    //
    //     url += urlToOpen;
    //     window.open(url, '_blank');
    // }
    //
    // private addScrollEventHandler(): void {
    //     const tableBody = document.getElementsByClassName('body');
    //     const el = <HTMLDivElement>tableBody[0];
    //     // some times we get negative scroll position, so we don't want to trigger load more data when scrolling back up
    //     let lastScroll = Number.MAX_VALUE;
    //     if (el) {
    //         el.onscroll = () => {
    //             const computed = getComputedStyle(el);
    //             const outer = el.offsetHeight + parseInt(computed.marginBottom, 10) + parseInt(computed.marginTop, 10);
    //             const currentScroll = el.scrollHeight - el.scrollTop - outer;
    //             if (currentScroll < 1 && currentScroll < lastScroll) {
    //                 if (this.ngRedux.getState().sweepsState.isAllSweepsLoaded) {
    //                     lastScroll = currentScroll;
    //                     return;
    //                 }
    //                 this.sweepsActions.getSweeps({
    //                     user_account_id: this.userAccountId,
    //                     lastUserSweep: this.sweeps[this.sweeps.length - 1]
    //                 }, SweepsMode.active);
    //             }
    //             lastScroll = currentScroll;
    //         };
    //     }
    // }
}
