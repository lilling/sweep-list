import { IErrorState, INITIAL_ERROR_STATE } from './errors/error.state';

export interface CommonState {
    errorState: IErrorState;
    sideNav: boolean;
    route: string;
}

export const INITIAL_COMMON_STATE: CommonState = {
    errorState: INITIAL_ERROR_STATE,
    sideNav: false,
    route: ''
};
