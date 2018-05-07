import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
//
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
//
import { AddSweepComponent } from '../add-sweep/add-sweep.component';
import { user_sweep_display } from '../../../shared/classes';

@Component({
    selector: 'app-sweep-list',
    templateUrl: 'sweep-list.component.html',
    styleUrls: ['sweep-list.component.scss']
})
export class SweepListComponent implements OnInit {
    isSweepsLoading$: Observable<boolean>;
    sweeps$: Observable<user_sweep_display[]>;

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {
    }

    addSweep() {
        this.dialog.open(AddSweepComponent);
    }
}
