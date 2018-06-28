import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//
import { SweepsService } from '../services/sweeps.service';
import { user_sweep, Search } from '../../../shared/classes';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { SweepsActions } from '../state/sweeps/sweeps.actions';

@Component({
    selector: 'app-to-do',
    templateUrl: 'to-do.component.html',
    styleUrls: ['to-do.component.scss']
})
export class ToDoComponent implements OnInit {
    currentSearch: Search;

    functions = [this.sweepsService.getTodaySweeps, this.sweepsService.getTomorrowSweeps, this.sweepsService.getLaterSweeps];
    selectedFunction = this.functions[0];
    sweeps: user_sweep[];

    constructor(private sweepsService: SweepsService, private sweepsActions: SweepsActions, private router: Router) {
    }

    ngOnInit() {
        const id = localStorage.getItem(LocalStorageKeys.loggedUser);
        this.currentSearch = {
            user_account_id: +id
        };
        this.selectedIndexChanged(0);
    }

    selectedIndexChanged(index: number, last?: user_sweep) {
        this.selectedFunction = this.functions[index];
        this.selectedFunction(this.currentSearch)
        //    .take(1).toPromise().then
            .subscribe
        (sweeps => this.sweeps = sweeps);
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
}