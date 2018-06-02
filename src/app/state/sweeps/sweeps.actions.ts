import { Injectable } from '@angular/core';
//
import { NgRedux } from '@angular-redux/store';
//
import { AppState } from '../store';
import { user_sweep } from '../../../../shared/classes';

@Injectable()
export class SweepsActions {

    static ADD_SWEEP = '[SweepsActions] ADD_SWEEP';
    static ADD_SWEEP_COMPLETED = '[SweepsActions] ADD_SWEEP_COMPLETED';
    static ADD_SWEEP_FAILED = '[SweepsActions] ADD_SWEEP_FAILED';
    static GET_USER_SWEEPS = '[SweepsActions] GET_USER_SWEEPS';
    static GET_USER_SWEEPS_COMPLETED = '[SweepsActions] GET_USER_SWEEPS_COMPLETED';
    static GET_USER_SWEEPS_FAILED = '[SweepsActions] GET_USER_SWEEPS_FAILED';
    static DELETE_SWEEP = '[SweepsActions] DELETE_SWEEP';
    static DELETE_SWEEP_COMPLETED = '[SweepsActions] DELETE_SWEEP_COMPLETED';
    static UPDATE_SWEEP = '[SweepsActions] UPDATE_SWEEP';
    static UPDATE_SWEEP_COMPLETED = '[SweepsActions] UPDATE_SWEEP_COMPLETED';

    constructor(private ngRedux: NgRedux<AppState>) {
    }

    getUserSweeps(user_account_id: string, lastUserSweep?: user_sweep) {
        this.ngRedux.dispatch({ type: SweepsActions.GET_USER_SWEEPS, payload: { user_account_id, lastUserSweep } });
    }

    addSweep(sweep: user_sweep) {
        this.ngRedux.dispatch({ type: SweepsActions.ADD_SWEEP, payload: sweep });
    }

    deleteSweep(id: number) {
        this.ngRedux.dispatch({ type: SweepsActions.DELETE_SWEEP, payload: id });
    }

    updateSweep(sweep: user_sweep) {
        this.ngRedux.dispatch({ type: SweepsActions.UPDATE_SWEEP, payload: sweep });
    }
}
