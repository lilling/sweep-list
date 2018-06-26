import { TypedAction } from '../models/typed-action';
import { INITIAL_SWEEPS_STATE, SweepsState } from './sweeps.state';
import { SweepsActions } from './sweeps.actions';
import { user_sweep } from '../../../../shared/classes';

export function sweepsReducer(state: SweepsState = INITIAL_SWEEPS_STATE, action: TypedAction<any>) {
    switch (action.type) {
        case SweepsActions.GET_USER_SWEEPS: {
            return {
                ...state,
                isSweepsLoading: true
            };
        }
        case SweepsActions.GET_USER_SWEEPS_COMPLETED: {
            const newSweeps: user_sweep[] = action.payload;
            const relevantSweeps = state.sweeps.deleteItems(newSweeps.map(sweep => sweep.user_sweep_id));
            return {
                ...state,
                sweeps: relevantSweeps.addItems(newSweeps),
                isSweepsLoading: false,
                isAllSweepsLoaded: action.payload.length === 0
            };
        }
        case SweepsActions.ADD_SWEEP: {
            return {
                ...state,
                isSweepsLoading: true
            };
        }
        case SweepsActions.ADD_SWEEP_COMPLETED: {
            return {
                ...state,
                sweeps: state.sweeps.addItem(action.payload, sort),
                isSweepsLoading: false
            };
        }
        case SweepsActions.ENTER_SWEEP_COMPLETED: {
            const old = state.sweeps.getItem(action.payload);
            const updated = {
                ...old,
                last_entry_date: new Date(),
                total_entries: old.total_entries ? old.total_entries + 1 : 1
            };
            return {
                ...state,
                sweeps: state.sweeps.updateItem(updated)
            };
        }
        case SweepsActions.DELETE_SWEEP_COMPLETED: {
            return {
                ...state,
                sweeps: state.sweeps.deleteItem(action.payload.user_sweep_id)
            };
        }
        case SweepsActions.UPDATE_SWEEP_COMPLETED: {
            return {
                ...state,
                sweeps: state.sweeps.updateItem(action.payload)
            };
        }
        default:
            return state;
    }
}

function sort(a: user_sweep, b: user_sweep) {
    if (!a.deleted_yn && b.deleted_yn) {
        return -1;
    } else if (a.deleted_yn && !b.deleted_yn) {
        return 1;
    } else if (a.end_date.getTime() > b.end_date.getTime()) {
        return 1;
    } else if (a.end_date.getTime() < b.end_date.getTime()) {
        return -1;
    } else if (a.last_entry_date.getTime() < b.last_entry_date.getTime()) {
        return -1;
    } else if (a.last_entry_date.getTime() > b.last_entry_date.getTime()) {
        return 1;
    }
    return a.user_sweep_id > b.user_sweep_id ? -1 : 1;
}