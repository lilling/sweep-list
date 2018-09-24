import { Component, Inject} from '@angular/core';
//
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-text-popup',
    templateUrl: 'text-popup.component.html',
    styleUrls: ['text-popup.component.scss']
})
export class TextPopupComponent {

    constructor(public dialogRef: MatDialogRef<TextPopupComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }
    /*ngOnInit() {
    }*/
}
