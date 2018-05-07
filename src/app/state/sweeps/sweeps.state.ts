import { user_sweep_display } from '../../../../shared/classes';

export interface SweepsState {
    sweeps: user_sweep_display[];
    isSweepsLoading: boolean;
}

export const INITIAL_SWEEPS_STATE: SweepsState = {
    sweeps: [],
    isSweepsLoading: false,
};
