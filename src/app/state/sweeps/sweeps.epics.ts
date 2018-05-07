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

@Injectable()
export class SweepsEpics extends BaseEpic {

    constructor(private sweepsService: SweepsService) {
        super();
    }

    @Epic
    login(action$: ActionsObservable<TypedAction<string>>) {
        return action$.ofType(SweepsActions.GET_USER_SWEEPS)
            .switchMap(action => {
                return this.sweepsService.getLiveSweeps(action.payload).pipe(
                    map(res => {
                        return { type: SweepsActions.GET_USER_SWEEPS_COMPLETED, payload: res };
                    }),
                    catchError(err => {
                        return of(generateError(err, SweepsActions.GET_USER_SWEEPS));
                    }));

            });
    }
}
