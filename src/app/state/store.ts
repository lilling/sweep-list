import { combineReducers } from 'redux';
import { TypedAction } from './models/typed-action';
import { CommonState, INITIAL_COMMON_STATE } from './common/common.state';
import { commonReducer } from './common/common.reducer';
import { LoginState, INITIAL_LOGIN_STATE } from './login/login.state';
import { loginReducer } from './login/login.reducer';
//

export interface AppState {
    commonState: CommonState;
    loginState: LoginState;
}

export const INITIAL_STATE: AppState = {
    commonState: INITIAL_COMMON_STATE,
    loginState: INITIAL_LOGIN_STATE,
};

export const appReducer = combineReducers<AppState>({
    commonState: commonReducer,
    loginState: loginReducer,
});

export const rootReducer = (state: AppState, action: TypedAction<any>) => {
    switch (action.type) {
        default:
    }
    return appReducer(state, action);
};
