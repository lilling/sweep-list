import { SocialUser } from 'angularx-social-login';
import { user_accountFields, facebook_accountFields } from './DB';

export class SocialUserAndAccount extends SocialUser{
    user_account_id: user_accountFields.user_account_id;
    expiration_date: facebook_accountFields.expiration_date;
    auth_error: facebook_accountFields.auth_error;

    constructor(data: SocialUserAndAccount) {
        super();

        this.user_account_id = data.user_account_id ? data.user_account_id : null;
        this.authToken = data.authToken ? data.authToken : null;
        this.email = data.email ? data.email : null;
        this.firstName = data.firstName ? data.firstName : null;
        this.id = data.id ? data.id : null;
        this.idToken = data.idToken ? data.idToken : null;
        this.lastName = data.lastName ? data.lastName : null;
        this.name = data.name ? data.name : null;
        this.photoUrl = data.photoUrl ? data.photoUrl : null;
        this.provider = data.provider ? data.provider : null;
        this.expiration_date = data.expiration_date ? data.expiration_date : null;
        this.auth_error = data.auth_error ? data.auth_error : null;
    }
}

export class Account {
    user_account_id: user_accountFields.user_account_id;
}

export class FBAccount{
    provider: string;
    facebook_account_id: string;
    user_account_id: number;
    first_name: string;
    last_name: string;
    email: string;
    photo_url: string;
    auth_token: string;
    id_token: string;
    created: Date;
    updated: Date;
}
