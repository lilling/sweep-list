import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
//
import { user_sweep, user_account } from '../../../../shared/classes';
import { SweepsActions } from '../../state/sweeps/sweeps.actions';
import { SweepsMode } from '../../state/sweeps/sweeps.state';

@Component({
    selector: 'app-with-sm-actions-list',
    templateUrl: 'with-sm-actions-list.component.html',
    styleUrls: ['with-sm-actions-list.component.scss']
})
export class WithSmActionsListComponent {

    @Input() sweeps: {
        data: user_sweep,
        text: string
    }[];
    @Input() user: user_account;
    @Input() mode: SweepsMode;

    constructor(private router: Router,
                private sweepsActions: SweepsActions) {
    }

    nextEntry(sweep: {data: user_sweep, text: string}) {
        const nextEntry = sweep.data.frequency_days * 864e5 - (Date.now() - sweep.data.last_entry_date.getTime());

        if (nextEntry < 0) {
            const entriesMissed = -1 * nextEntry / (sweep.data.frequency_days * 864e5);
            return `${entriesMissed.toFixed(0)} entries missed, you should enter right now`;
            // TODO: if there are missed entries, popup: "What a shame, you missed some entries. Please check in more frequently to let me serve you better."
        }

        let returnValue = '';

        const days = nextEntry / 864e5;

        if (days > 1) {
            returnValue = `${days.toFixed(0)} days`;
        } else {
            const hours = nextEntry / 36e5;
            if (hours > 1) {
                returnValue = `${hours.toFixed(0)} hours`;
            } else {
                const minutes = nextEntry / 6e4;

                returnValue = `${minutes.toFixed(0)} minutes`;
            }
        }

        return `${returnValue} left to next entry.`;
    }

}
