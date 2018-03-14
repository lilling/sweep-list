import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
//
import { LocalStorageService } from 'angular-2-local-storage';
//
import { AddSweepComponent } from '../add-sweep/add-sweep.component';
import { SweepsService } from '../services/sweeps.service';
import { LocalStorageKeys } from '../models/local-storage-keys.enum';
import { user_sweep_display } from '../../../shared/classes';

@Component({
    selector: 'app-sweep-list',
    templateUrl: 'sweep-list.component.html',
    styleUrls: ['sweep-list.component.scss']
})
export class SweepListComponent {
    sweeps: user_sweep_display[];

    constructor(public dialog: MatDialog,
                private sweepsService: SweepsService,
                private localStorageService: LocalStorageService) {
        const userAcountId = this.localStorageService.get<string>(LocalStorageKeys.loggedUser);
        sweepsService.getLiveSweeps(userAcountId).subscribe(liveSweeps => {
            this.sweeps = liveSweeps;
        });
    }

    addSweep() {
        this.dialog.open(AddSweepComponent);
    }
}
