import { user_sweep_display } from '../../../../shared/classes';
import { ActionsUnion, ActionTypes } from '../actions/sweeps.actions';

export interface IState {
    sweeps: user_sweep_display[];
    loading: boolean;
    loaded: boolean;
}

export const INITIAL_STATE: IState = {
    sweeps: [],
    loading: false,
    loaded: false
};

export function reducer(state: IState = INITIAL_STATE, action: ActionsUnion): IState {
    switch (action.type) {
        case ActionTypes.ADD_SWEEP: {
            return {
                ...state,
                loading: true
            };
        }
        case ActionTypes.ADD_SWEEP_COMPLETED: {
            return {
                ...state,
                sweeps: [...state.sweeps, action.payload],
                loading: false,
                loaded: true
            };
        }
        case ActionTypes.ADD_SWEEP_FAILED: {
            return {
                ...state,
                loading: false,
                loaded: false
            };
        }
        case ActionTypes.LOAD_SWEEPS: {
            return {
                ...state,
                loading: true
            };
        }
        case ActionTypes.LOAD_SWEEPS_COMPLETED: {
            return {
                ...state,
                loading: false,
                sweeps: [...state.sweeps, ...action.payload]
            };
        }
        case ActionTypes.DELETE_SWEEP: {
            return {
                ...state,
                sweeps: state.sweeps.filter(sweep => sweep.user_sweep_id === action.payload)
            };
        }
        default: {
            return state;
        }
    }
}

export const getSweepsLoading = (state: IState) => state.loading;
export const getSweepsLoaded = (state: IState) => state.loaded;
export const getSweeps = (state: IState) => state.sweeps;
