import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-sweep',
  templateUrl: 'add-sweep.component.html',
  styleUrls: ['add-sweep.component.scss']
})
export class AddSweepComponent {
    sweepName: string;
    constructor(
        public dialogRef: MatDialogRef<AddSweepComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
