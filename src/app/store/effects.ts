import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs/observable';
import {of} from 'rxjs/observable/of';
import {
    ActionsUnion,
    ActionTypes,
    AddSweep,
    AddSweepCompleted,
    AddSweepFailed,
    LoadSweeps,
    LoadSweepsCompleted,
    LoadSweepsFailed
} from './actions/sweeps.actions';
import {SweepsService} from '../services/sweeps.service';
import {Action} from '@ngrx/store';

@Injectable()
export class Effects {

    @Effect()
    loadSweeps$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSweeps>(ActionTypes.LOAD_SWEEPS),
        mergeMap(action =>
            this.sweepsService.getLiveSweeps(action.payload).pipe(
                map(data => new LoadSweepsCompleted(data)),
                catchError(err => of(new LoadSweepsFailed(err)))
            )
        )
    );

    @Effect()
    addSweep$: Observable<Action> = this.actions$.pipe(
        ofType<AddSweep>(ActionTypes.ADD_SWEEP),
        mergeMap(action =>
            this.sweepsService.addOrUpdateSweep(action.payload).pipe(
                // If successful, dispatch success action with result
                map(data => new AddSweepCompleted(data)),
                // If request fails, dispatch failed action
                catchError(err => of(new AddSweepFailed(err)))
            )
        )
    );

    constructor(private sweepsService: SweepsService, private actions$: Actions<ActionsUnion>) {}
}
