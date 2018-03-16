import { FBAccount } from './SocialUserAndAccount';

export class PostToPublishRaw{
    user_account_id: number;
    user_sweep_id: number;
    link: string;
    message: string;
    refer_facebook: boolean;
    refer_twitter: boolean;
    refer_google: boolean;
    refer_linkedin: boolean;
    refer_pinterest: boolean;
}

export class PostToPublish{
    user_account_id: number;
    user_sweep_id: number;
    link: string;
    message: string;
    provider: string;
    provider_account_id: string;
    auth_token: string;
    id_token: string;

    constructor(data: PostToPublishRaw, accout){
        this.user_account_id = data.user_account_id;
        this.user_sweep_id = data.user_sweep_id;
        this.link = data.link;
        this.message = data.message;
        this.provider = accout.provider;
        this.provider_account_id = accout.facebook_account_id;
        this.auth_token = accout.auth_token;
        this.id_token = accout.id_token;
    }
}