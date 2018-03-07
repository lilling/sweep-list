import { SocialUser } from 'angularx-social-login';
import { user_accountFields } from './DB';

export declare class SocialUserAndAccount extends SocialUser{
    user_account_id: user_accountFields.user_account_id
}

export declare class Account{
    user_account_id: user_accountFields.user_account_id
}

export declare class win{
    win_year: number;
    win_month: string;
    month_numeric: number;
    prize_value_sum: number;
}

export declare class URL{
    user_sweep_id: number;
    sweep_url: string;
}

export declare class PostToPublishRaw{
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

export declare class PostToPublish{
    user_account_id: number;
    user_sweep_id: number;
    link: string;
    message: string;
    provider: string;
    provider_account_id: string;
    auth_token: string;
    id_token: string;
}

