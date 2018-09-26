import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
//
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { combineLatest } from 'rxjs/observable/combineLatest';
//
import { AddSweepComponent } from '../add-sweep/add-sweep.component';
import { user_sweep, user_account, Win } from '../../../shared/classes';
import { AppState } from '../state/store';
import { SweepsActions } from '../state/sweeps/sweeps.actions';
import { SweepsMode } from '../state/sweeps/sweeps.state';
import { SweepsService } from '../services/sweeps.service';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { Subscriber } from '../classes/subscriber';

@Component({
    selector: 'app-wins',
    templateUrl: 'wins.component.html',
    styleUrls: ['wins.component.scss']
})
export class WinsComponent extends Subscriber implements OnInit {
    @select((state: AppState) => state.sweepsState.isSweepsLoading)
    isSweepsLoading$: Observable<boolean>;
    userAccountId: AAGUID;
    userWins: Win[];

    constructor(public sweepsService: SweepsService) {
        super();
    }

    ngOnInit() {
        this.userAccountId = localStorage.getItem(LocalStorageKeys.loggedUser);
        this.sweepsService.getUserWins(this.userAccountId).subscribe(wins => this.userWins = wins);
    }

    getWinValueText(wins: number):string{
        if (wins > 0) {
            return `$${wins} total`;
        }
        return `No prize values`;
    }

    /*private addScrollEventHandler(): void {
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
                        user_account_id: this.userAccountId,
                        enabled_social_media_bitmap: this.user.enabled_social_media_bitmap,
                        lastUserSweep: this.sweeps[this.sweeps.length - 1].data
                    }, SweepsMode.active);
                }
                lastScroll = currentScroll;
            };
        }
    }*/
}
