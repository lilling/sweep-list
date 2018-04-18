import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
//
import * as sweeps from './sweeps.reducer';

export interface IAppState {
    sweeps: sweeps.IState;
}

export const reducers: ActionReducerMap<IAppState> = {
    sweeps: sweeps.reducer
};

export const getSweepsState = createFeatureSelector('sweeps');

export const getSweeps = createSelector(getSweepsState, sweeps.getSweeps);
export const getSweepsLoaded = createSelector(getSweepsState, sweeps.getSweepsLoaded);
export const getSweepsLoading = createSelector(getSweepsState, sweeps.getSweepsLoading);


