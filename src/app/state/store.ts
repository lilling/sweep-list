import { combineReducers } from 'redux';
import { TypedAction } from './models/typed-action';
import { CommonState, INITIAL_COMMON_STATE } from './common/common.state';
import { commonReducer } from './common/common.reducer';
//

export interface AppState {
    commonState: CommonState;
}

export const INITIAL_STATE: AppState = {
    commonState: INITIAL_COMMON_STATE,
};

export const appReducer = combineReducers<AppState>({
    commonState: commonReducer,
});

export const rootReducer = (state: AppState, action: TypedAction<any>) => {
    switch (action.type) {
        default:
    }
    return appReducer(state, action);
};
