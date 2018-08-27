import { HttpErrorResponse } from '@angular/common/http';
//
import { ErrorActions } from '../common/errors/error.actions';
import { TypedAction } from './typed-action';
import { IClientError } from '../../../../shared/classes/client-error.interface';

export function generateError(error: HttpErrorResponse, actionType: string): TypedAction<IClientError> {
    return { type: ErrorActions.ERROR_OCCURED, payload: { actionType, error } };
}
