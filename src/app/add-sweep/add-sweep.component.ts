import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-add-sweep',
    templateUrl: 'add-sweep.component.html',
    styleUrls: ['add-sweep.component.scss']
})
export class AddSweepComponent {
    nameFormControl = new FormControl('', [ Validators.required ]);
    endDateFormControl = new FormControl({ disabled: true }, [ Validators.required ]);
    endDate: Date;
    name: string;

    constructor(public dialogRef: MatDialogRef<AddSweepComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onEndDateSelect() {

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
