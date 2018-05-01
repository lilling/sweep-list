import { IErrorState, INITIAL_ERROR_STATE } from './errors/error.state';

export interface CommonState {
    errorState: IErrorState;
}

export const INITIAL_COMMON_STATE: CommonState = {
    errorState: INITIAL_ERROR_STATE
};
