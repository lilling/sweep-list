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
                sweeps: state.sweeps.addItem(action.payload),
                isSweepsLoading: false
            };
        }
        default:
            return state;
    }
}
