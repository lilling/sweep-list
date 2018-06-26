import { combineReducers } from 'redux';
//
import { CommonState } from './common.state';
import { errorReducer } from './errors/error.reducer';
import { TypedAction } from '../models/typed-action';
import { CommonActions } from './common.actions';

export const commonReducer = combineReducers<CommonState>({
    errorState: errorReducer,
    sideNav: (state: boolean = false, action: TypedAction<boolean>) => {
        switch (action.type) {
            case CommonActions.TOGGLE_SIDE_NAV:
                return !state;
            default:
                return state;
        }
    }
});
