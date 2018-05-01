import { IErrorState, INITIAL_ERROR_STATE } from './error.state';
import { ErrorActions } from './error.actions';
import { TypedAction } from '../../models/typed-action';
import { IClientError } from '../../../../../shared/classes/client-error.interface';

export function errorReducer(state: IErrorState = INITIAL_ERROR_STATE, action: TypedAction<any>) {
    switch (action.type) {
        case ErrorActions.ERROR_OCCURED:
            const errorData: IClientError = action.payload;
            return {
                ...state,
                errorMap: {
                    ...state.errorMap,
                    [errorData.actionType]: errorData
                }
            };
        case ErrorActions.CLEAR_ERROR:
            const currentErrors = { ...state.errorMap };
            delete currentErrors[action.payload];
            return {
                ...state,
                errorMap: currentErrors
            };
        default:
            return state;
    }
}
