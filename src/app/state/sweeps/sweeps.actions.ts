import { Injectable } from '@angular/core';
//
import { NgRedux } from '@angular-redux/store';
//
import { AppState } from '../store';
import { user_sweep, Search } from '../../../../shared/classes';
import { SweepsMode } from './sweeps.state';

@Injectable()
export class SweepsActions {

    static GO_TO_SWEEPS = '[SweepsActions] GO_TO_SWEEPS';
    static GET_SWEEPS = '[SweepsActions] GET_SWEEPS';
    static GET_SWEEPS_COMPLETED = '[SweepsActions] GET_SWEEPS_COMPLETED';
    static ADD_SWEEP = '[SweepsActions] ADD_SWEEP';
    static ADD_SWEEP_COMPLETED = '[SweepsActions] ADD_SWEEP_COMPLETED';
    static ENTER_SWEEP = '[SweepsActions] ENTER_SWEEP';
    static ENTER_SWEEP_COMPLETED = '[SweepsActions] ENTER_SWEEP_COMPLETED';
    static DELETE_SWEEP = '[SweepsActions] DELETE_SWEEP';
    static DELETE_SWEEP_COMPLETED = '[SweepsActions] DELETE_SWEEP_COMPLETED';
    static UPDATE_SWEEP = '[SweepsActions] UPDATE_SWEEP';
    static UPDATE_SWEEP_COMPLETED = '[SweepsActions] UPDATE_SWEEP_COMPLETED';
    static WIN_OR_UNWIN_SWEEP = '[SweepsActions] WIN_OR_UNWIN_SWEEP';
    static WIN_OR_UNWIN_SWEEP_COMPLETED = '[SweepsActions] WIN_OR_UNWIN_SWEEP_COMPLETED';

    constructor(private ngRedux: NgRedux<AppState>) {
    }

    goToSweeps(mode: SweepsMode) {
        this.ngRedux.dispatch({ type: SweepsActions.GO_TO_SWEEPS, payload: mode });
    }

    getSweeps(search: Search, mode: SweepsMode) {
        this.ngRedux.dispatch({ type: SweepsActions.GET_SWEEPS, payload: { search, mode } });
    }

    enterSweep(sweep_id: number) {
        this.ngRedux.dispatch({ type: SweepsActions.ENTER_SWEEP, payload: sweep_id });
    }

    addSweep(sweep: user_sweep) {
        this.ngRedux.dispatch({ type: SweepsActions.ADD_SWEEP, payload: sweep });
    }

    deleteSweep(sweep_id: number) {
        this.ngRedux.dispatch({ type: SweepsActions.DELETE_SWEEP, payload: sweep_id });
    }

    updateSweep(sweep: user_sweep) {
        this.ngRedux.dispatch({ type: SweepsActions.UPDATE_SWEEP, payload: sweep });
    }

    winOrUnwinSweep(win_action: string, sweep_id: number, prize_value?: number) {
        this.ngRedux.dispatch({ type: SweepsActions.WIN_OR_UNWIN_SWEEP, payload: {win_action, sweep_id, prize_value} });
    }
}
