import { SocialUser } from 'angularx-social-login';
import { user_accountFields } from './DB';

export class SocialUserAndAccount extends SocialUser{
    user_account_id: user_accountFields.user_account_id;
}

export class Account{
    user_account_id: user_accountFields.user_account_id;
}
