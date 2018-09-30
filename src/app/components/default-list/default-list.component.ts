import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
//
import { user_sweep } from '../../../../shared/classes';
import { SweepsService } from '../../services/sweeps.service';

@Component({
    selector: 'app-default-list',
    templateUrl: 'default-list.component.html',
    styleUrls: ['default-list.component.scss']
})
export class DefaultListComponent {

    @Input() sweeps: {
        data: user_sweep,
        text: string
    }[];

    constructor(public router: Router,
                public sweepsService: SweepsService) {
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
}
