import { combineReducers } from 'redux';
//
import { TypedAction } from './models/typed-action';
import { CommonState, INITIAL_COMMON_STATE } from './common/common.state';
import { commonReducer } from './common/common.reducer';
import { LoginState, INITIAL_LOGIN_STATE } from './login/login.state';
import { loginReducer } from './login/login.reducer';
import { SweepsState, INITIAL_SWEEPS_STATE } from './sweeps/sweeps.state';
import { sweepsReducer } from './sweeps/sweeps.reducer';

export interface AppState {
    commonState: CommonState;
    loginState: LoginState;
    sweepsState: SweepsState;
}

export const INITIAL_STATE: AppState = {
    commonState: INITIAL_COMMON_STATE,
    loginState: INITIAL_LOGIN_STATE,
    sweepsState: INITIAL_SWEEPS_STATE,
};

export const appReducer = combineReducers<AppState>({
    commonState: commonReducer,
    loginState: loginReducer,
    sweepsState: sweepsReducer,
});

export const rootReducer = (state: AppState, action: TypedAction<any>) => {
    return appReducer(state, action);
};
