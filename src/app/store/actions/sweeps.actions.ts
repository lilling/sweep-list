import { Action } from '@ngrx/store';
//
import { user_sweep, user_sweep_display } from '../../../../shared/classes';

export enum ActionTypes {
    ADD_SWEEP = '[SWEEPS] ADD_SWEEP',
    ADD_SWEEP_COMPLETED = '[SWEEPS] ADD_SWEEP_COMPLETED',
    ADD_SWEEP_FAILED = '[SWEEPS] ADD_SWEEP_FAILED',
    LOAD_SWEEPS = '[SWEEPS] LOAD_SWEEPS',
    LOAD_SWEEPS_COMPLETED = '[SWEEPS] LOAD_SWEEPS_COMPLETED',
    LOAD_SWEEPS_FAILED = '[SWEEPS] LOAD_SWEEPS_FAILED',
    DELETE_SWEEP = '[SWEEPS] DELETE_SWEEP',
}

export class AddSweep implements Action {
    readonly type = ActionTypes.ADD_SWEEP;

    constructor(public payload: user_sweep) {
    }
}

export class LoadSweeps implements Action {
    readonly type = ActionTypes.LOAD_SWEEPS;

    constructor(public payload: string) {
    }
}

export class LoadSweepsCompleted implements Action {
    readonly type = ActionTypes.LOAD_SWEEPS_COMPLETED;

    constructor(public payload: user_sweep_display[]) {
    }
}

export class LoadSweepsFailed implements Action {
    readonly type = ActionTypes.LOAD_SWEEPS_FAILED;

    constructor(public payload: any) {
    }
}

export class AddSweepCompleted implements Action {
    readonly type = ActionTypes.ADD_SWEEP_COMPLETED;

    constructor(public payload: user_sweep_display) {
    }
}

export class AddSweepFailed implements Action {
    readonly type = ActionTypes.ADD_SWEEP_FAILED;

    constructor(public payload: any) {
    }
}

export class DeleteSweep implements Action {
    readonly type = ActionTypes.DELETE_SWEEP;

    constructor(public payload: number) {
    }
}

export type ActionsUnion =
    AddSweep
    | DeleteSweep
    | AddSweepFailed
    | AddSweepCompleted
    | LoadSweeps
    | LoadSweepsCompleted
    | LoadSweepsFailed;
