import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
//
import { user_sweep } from '../../../../shared/classes';
import { WinPopupComponent } from '../../win-popup/win-popup.component';

@Component({
    selector: 'app-ended-list',
    templateUrl: 'ended-list.component.html',
    styleUrls: ['ended-list.component.scss']
})
export class EndedListComponent {

    @Input() sweeps: {
        data: user_sweep,
        text: string
    }[];

    constructor(private router: Router, public dialog: MatDialog) {
    }

    winSweep(user_sweep_id: number) {
        this.dialog.open(WinPopupComponent, { width: '270px', data: { winAction: 'win', userSweepId: user_sweep_id } });
    }

    unwinSweep(user_sweep_id: number) {
        this.dialog.open(WinPopupComponent, { data: { winAction: 'unwin', userSweepId: user_sweep_id } });
    }
}
