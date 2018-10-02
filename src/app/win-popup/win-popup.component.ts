import { Component, Inject, Input, EventEmitter } from '@angular/core';
//
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
//
import { SweepsActions } from '../state/sweeps/sweeps.actions';
import { TextPopupComponent } from '../text-popup/text-popup.component';
import { SocialMedia } from '../../../shared/models/social-media.enum';

@Component({
    selector: 'app-win-popup',
    templateUrl: 'win-popup.component.html',
    styleUrls: ['win-popup.component.scss']
})
export class WinPopupComponent {
    prize: string;
    isValidChange: boolean;
    step: number;
    SocialMedia = SocialMedia;

    prizeValueChange = new EventEmitter();

    constructor(public dialogRef: MatDialogRef<WinPopupComponent>,
                public dialog: MatDialog,
                private sweepsActions: SweepsActions,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.step = 1;
    }

    ngOnInit() {
        this.isValidChange = true;
        this.prize = null;
    }

    step1done() {
        if (this.data.winAction=='win'){
            ++this.step;
        } else {
            this.sweepsActions.winOrUnwinSweep(this.data.winAction, this.data.user_sweep_id);
            this.dialogRef.close();
        }
    }

    step2done(thanked: boolean){
        this.sweepsActions.winOrUnwinSweep(this.data.winAction, this.data.user_sweep_id, +this.prize, thanked);
        this.dialogRef.close();
    }
    
    @Input() get prizeValue() { return this.prize; }
    set prizeValue(val: string) {
        this.prize = val;
        this.isValidChange = !this.isPrizeInvalid(this.prize);
        this.prizeValueChange.emit(this.prize);
    }

    isPrizeInvalid(val) {
        return isNaN(Number(val)) || val < 0;
    }

    showExplanation(){
        this.dialog.open(TextPopupComponent, {width: '300px', data:{text: `Entering a prize value will let me help you with your annual tax decleration (1040 form in USA). You don't have to.`}});
    }
}
