import { Injectable } from '@angular/core';
//
import { NgRedux } from '@angular-redux/store';
//
import { AppState } from '../store';

@Injectable()
export class CommonActions {
    constructor(private ngRedux: NgRedux<AppState>) {}
}
