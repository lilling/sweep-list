import { LoginState, INITIAL_LOGIN_STATE } from './login.state';
import { LoginActions } from './login.actions';
import { TypedAction } from '../models/typed-action';

export function loginReducer(state: LoginState = INITIAL_LOGIN_STATE, action: TypedAction<any>) {
    switch (action.type) {
        case LoginActions.LOGIN_COMPLETED:
        case LoginActions.UPDATE_USER_COMPLETED:
            return {
                ...state,
                user: action.payload.user ? action.payload.user : action.payload,
                isNew: action.payload.isNew,
            };
        case LoginActions.LOGOFF_COMPLETED:
            return INITIAL_LOGIN_STATE;
        default:
            return state;
    }
}
