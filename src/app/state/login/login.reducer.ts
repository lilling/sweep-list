import { LoginState, INITIAL_LOGIN_STATE } from './login.state';
import { LoginActions } from './login.actions';
import { TypedAction } from '../models/typed-action';

export function loginReducer(state: LoginState = INITIAL_LOGIN_STATE, action: TypedAction<any>) {
    switch (action.type) {
        case LoginActions.LOGIN_COMPLETED:
            return {
                ...state,
                user: action.payload
            };
        case LoginActions.LOGOFF_COMPLETED:
            return INITIAL_LOGIN_STATE;
        default:
            return state;
    }
}
