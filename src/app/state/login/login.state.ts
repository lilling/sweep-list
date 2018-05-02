import { user_account } from '../../../../shared/classes';

export interface LoginState {
    user: user_account;
}

export const INITIAL_LOGIN_STATE: LoginState = {
    user: null
};
