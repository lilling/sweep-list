import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
//
import { user_sweep } from '../../../../shared/classes';
import { WinPopupComponent } from '../../win-popup/win-popup.component';
import { SweepsActions } from '../../state/sweeps/sweeps.actions';

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

    @Input() user: user_sweep;

    constructor(private router: Router,
                public dialog: MatDialog,
                private sweepsActions: SweepsActions) {
    }

    winOrUnwinSweep(user_sweep: user_sweep) {
        this.dialog.open(WinPopupComponent, {data:{
            winAction: user_sweep.won_yn ? 'unwin' : 'win',
            user_sweep_id: user_sweep.user_sweep_id,
            thanks_to: user_sweep.thanks_to,
            thanks_social_media_id: user_sweep.thanks_social_media_id
        }});
    }

    thankReferrer(sweep: user_sweep){
        if (!sweep.thanked_yn){
            sweep.thanked_yn = true;
            this.sweepsActions.updateSweep(sweep);
        }
    }
}
