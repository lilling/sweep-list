import { Injectable } from '@angular/core';
//
import { ActionsObservable } from 'redux-observable';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
//
import { TypedAction } from '../models/typed-action';
import { BaseEpic } from '../models/base-epic';
import { Epic } from '../models/epic.decorator';
import { SweepsActions } from './sweeps.actions';
import { generateError } from '../models/error';
import { SweepsService } from '../../services/sweeps.service';
import { user_sweep } from '../../../../shared/classes';

@Injectable()
export class SweepsEpics extends BaseEpic {

    constructor(private sweepsService: SweepsService) {
        super();
    }

    @Epic
    getUserSweeps(action$: ActionsObservable<TypedAction<{user_account_id: string, lastUserSweep?: user_sweep}>>) {
        return action$.ofType(SweepsActions.GET_USER_SWEEPS)
            .switchMap(action => {
                return this.sweepsService.getLiveSweeps(action.payload).pipe(
                    map((res: user_sweep[]) => {
                        res.forEach(sweep => {
                            this.fixSweepTyes(sweep);
                        });
                        return { type: SweepsActions.GET_USER_SWEEPS_COMPLETED, payload: res };
                    }),
                    catchError(err => {
                        return of(generateError(err, SweepsActions.GET_USER_SWEEPS));
                    }));

            });
    }

    @Epic
    addSweep(action$: ActionsObservable<TypedAction<user_sweep>>) {
        return action$.ofType(SweepsActions.ADD_SWEEP)
            .switchMap(action => {
                return this.sweepsService.addOrUpdateSweep(action.payload).pipe(
                    map(res => {
                        this.fixSweepTyes(res);
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
                        this.fixSweepTyes(res);
                        return { type: SweepsActions.UPDATE_SWEEP_COMPLETED, payload: res };
                    }),
                    catchError(err => {
                        return of(generateError(err, SweepsActions.UPDATE_SWEEP));
                    }));

            });
    }

    private fixSweepTyes(sweep: user_sweep) {
        sweep.last_entry_date = sweep.last_entry_date ? new Date(sweep.last_entry_date) : null;
        sweep.created = sweep.created ? new Date(sweep.created) : null;
        sweep.updated = sweep.updated ? new Date(sweep.updated) : null;
        sweep.end_date = sweep.end_date ? new Date(sweep.end_date) : null;
        sweep.total_entries = sweep.total_entries ? +sweep.total_entries : null;
        sweep.total_shares = sweep.total_shares ? +sweep.total_shares : null;
        sweep.referral_frequency = sweep.referral_frequency ? +sweep.referral_frequency : null;
        sweep.frequency_days = sweep.frequency_days ? +sweep.frequency_days : null;
        sweep.user_account_id = sweep.user_account_id ? +sweep.user_account_id : null;
    }
}
