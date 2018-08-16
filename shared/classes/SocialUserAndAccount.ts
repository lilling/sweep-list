import { SocialUser } from 'angularx-social-login';

export class SocialUserAndAccount extends SocialUser {
    user_account_id: AAGUID;

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
    }
}

export class ExtandedSocialUser extends SocialUser {
    password?: string;
    isSocial: boolean;
}

export class Account {
    user_account_id: AAGUID;
}