import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddSweepComponent } from '../add-sweep/add-sweep.component';

@Component({
    selector: 'app-sweep-list',
    templateUrl: 'sweep-list.component.html',
    styleUrls: ['sweep-list.component.scss']
})
export class SweepListComponent {
    sweeps = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers', 'Clogs', 'Loafers',
        'Moccasins', 'Sneakers', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];

    constructor(public dialog: MatDialog) {
    }

    addSweep() {
        this.dialog.open(AddSweepComponent);
    }
}
