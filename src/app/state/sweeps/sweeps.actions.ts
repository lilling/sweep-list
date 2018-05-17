import { Injectable } from '@angular/core';
//
import { NgRedux } from '@angular-redux/store';
//
import { AppState } from '../store';
import { user_sweep, user_sweep_display } from '../../../../shared/classes';

@Injectable()
export class SweepsActions {

    static ADD_SWEEP = '[SweepsActions] ADD_SWEEP';
    static ADD_SWEEP_COMPLETED = '[SweepsActions] ADD_SWEEP_COMPLETED';
    static ADD_SWEEP_FAILED = '[SweepsActions] ADD_SWEEP_FAILED';
    static GET_USER_SWEEPS = '[SweepsActions] GET_USER_SWEEPS';
    static GET_USER_SWEEPS_COMPLETED = '[SweepsActions] GET_USER_SWEEPS_COMPLETED';
    static GET_USER_SWEEPS_FAILED = '[SweepsActions] GET_USER_SWEEPS_FAILED';


    constructor(private ngRedux: NgRedux<AppState>) {
    }

    getUserSweeps(userId: string, lastSweep?: user_sweep_display) {
        this.ngRedux.dispatch({ type: SweepsActions.GET_USER_SWEEPS, payload: {userId, lastSweep} });
    }

    addSweep(sweep: user_sweep) {
        this.ngRedux.dispatch({ type: SweepsActions.ADD_SWEEP, payload: sweep });
    }
}
