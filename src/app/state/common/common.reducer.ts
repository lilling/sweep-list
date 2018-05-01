import { combineReducers } from 'redux';
//
import { CommonState } from './common.state';
import { errorReducer } from './errors/error.reducer';

export const commonReducer = combineReducers<CommonState>({
    errorState: errorReducer
});
