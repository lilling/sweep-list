import { user_sweep } from '../../../../shared/classes';
import { HashedArray } from '../../models/hashed-array.class';

export interface SweepsState {
    sweeps: HashedArray<user_sweep>;
    isSweepsLoading: boolean;
    isAllSweepsLoaded: boolean;
}

export const INITIAL_SWEEPS_STATE: SweepsState = {
    sweeps: new HashedArray<user_sweep>([], 'user_sweep_id'),
    isSweepsLoading: true,
    isAllSweepsLoaded: false,
};
