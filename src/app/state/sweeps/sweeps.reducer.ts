import { TypedAction } from '../models/typed-action';
import { INITIAL_SWEEPS_STATE, SweepsState } from './sweeps.state';
import { SweepsActions } from './sweeps.actions';

export function sweepsReducer(state: SweepsState = INITIAL_SWEEPS_STATE, action: TypedAction<any>) {
    switch (action.type) {
        case SweepsActions.GET_USER_SWEEPS: {
            return {
                ...state,
                isSweepsLoading: true
            };
        }
        case SweepsActions.GET_USER_SWEEPS_COMPLETED: {
            return {
                ...state,
                sweeps: [
                    ...state.sweeps,
                    ...action.payload
                ],
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
                sweeps: [
                    ...state.sweeps,
                    action.payload
                ],
                isSweepsLoading: false
            };
        }
        default:
            return state;
    }
}
