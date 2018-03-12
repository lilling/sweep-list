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