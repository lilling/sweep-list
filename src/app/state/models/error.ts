import { ErrorActions } from '../common/errors/error.actions';
import { TypedAction } from './typed-action';
import { IClientError } from '../../../../shared/classes/client-error.interface';

export function generateError(error: Error, actionType: string, body?: any, isCritical?: boolean): TypedAction<IClientError> {
    const errorPath = getErrorPath(actionType);
    return { type: ErrorActions.ERROR_OCCURED, payload: { actionType: errorPath, error, body, isCritical} };
}

/**
 * Why separate function? this will be used in the component to pass an action you want to listen to errors on.
 * @param {string} path
 * @returns {string}
 */
export function getErrorPath(actionType: string): string {
    return `[ERROR] ${actionType}`;
}
