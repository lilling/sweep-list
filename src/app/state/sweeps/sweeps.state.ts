import { user_sweep } from '../../../../shared/classes';

export interface SweepsState {
    sweeps: user_sweep[];
    isSweepsLoading: boolean;
    isAllSweepsLoaded: boolean;
}

export const INITIAL_SWEEPS_STATE: SweepsState = {
    sweeps: [],
    isSweepsLoading: true,
    isAllSweepsLoaded: false,
};
