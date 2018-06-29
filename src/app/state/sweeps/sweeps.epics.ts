import { Injectable } from '@angular/core';
//
import { ActionsObservable } from 'redux-observable';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as _ from 'lodash';
//
import { TypedAction } from '../models/typed-action';
import { BaseEpic } from '../models/base-epic';
import { Epic } from '../models/epic.decorator';
import { SweepsActions } from './sweeps.actions';
import { generateError } from '../models/error';
import { SweepsService } from '../../services/sweeps.service';
import { user_sweep, Search } from '../../../../shared/classes';
import { SweepsMode } from './sweeps.state';

@Injectable()
export class SweepsEpics extends BaseEpic {

    constructor(private sweepsService: SweepsService) {
        super();
    }

    @Epic
    getUserSweeps(action$: ActionsObservable<TypedAction<{search: Search, mode: SweepsMode}>>) {
        return action$.ofType(SweepsActions.GET_SWEEPS)
            .switchMap(action => {
                return this.sweepsService.getSweeps(action.payload.search, action.payload.mode).pipe(
                    map((res: user_sweep[]) => {
                        return { type: SweepsActions.GET_SWEEPS_COMPLETED, payload: res };
                    }),
                    catchError(err => {
                        return of(generateError(err, SweepsActions.GET_SWEEPS));
                    }));

            });
    }

    @Epic
    addSweep(action$: ActionsObservable<TypedAction<user_sweep>>) {
        return action$.ofType(SweepsActions.ADD_SWEEP)
            .switchMap(action => {
                return this.sweepsService.addOrUpdateSweep(action.payload).pipe(
                    map(res => {
                        return { type: SweepsActions.ADD_SWEEP_COMPLETED, payload: res };
                    }),
                    catchError(err => {
                        return of(generateError(err, SweepsActions.ADD_SWEEP));
                    }));
            });
    }

    @Epic
    enterSweep(action$: ActionsObservable<TypedAction<number>>) {
        return action$.ofType(SweepsActions.ENTER_SWEEP)
            .switchMap(action => {
                return this.sweepsService.enterSweep(action.payload).pipe(
                    map(res => {
                        return { type: SweepsActions.ENTER_SWEEP_COMPLETED, payload: action.payload };
                    }),
                    catchError(err => {
                        return of(generateError(err, SweepsActions.ENTER_SWEEP));
                    }));
            })
    }

    @Epic
    deleteSweep(action$: ActionsObservable<TypedAction<number>>) {
        return action$.ofType(SweepsActions.DELETE_SWEEP)
            .switchMap(action => {
                return this.sweepsService.deleteSweep(action.payload).pipe(
                    map(res => {
                        return { type: SweepsActions.DELETE_SWEEP_COMPLETED, payload: res };
                    }),
                    catchError(err => {
                        return of(generateError(err, SweepsActions.DELETE_SWEEP));
                    }));

            });
    }

    @Epic
    updateSweep(action$: ActionsObservable<TypedAction<user_sweep>>) {
        return action$.ofType(SweepsActions.UPDATE_SWEEP)
            .switchMap(action => {
                return this.sweepsService.addOrUpdateSweep(action.payload).pipe(
                    map(res => {
                        return { type: SweepsActions.UPDATE_SWEEP_COMPLETED, payload: res };
                    }),
                    catchError(err => {
                        return of(generateError(err, SweepsActions.UPDATE_SWEEP));
                    }));

            });
    }
}
