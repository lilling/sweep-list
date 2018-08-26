/* tslint:disable */
/*
example: schemats generate -c postgres://hsrbfqoh:OASQR0O7qDLnHlIBgWcHiD_dKwz4dBoM@hard-plum.db.elephantsql.com:5432/hsrbfqoh -s sweepimp -o DB1.ts -t user_sweep
*/

import { SocialMedia } from '../models/social-media.enum';

export interface sweep_share {
    sweep_share_id: number;
    user_sweep_id: number;
    social_media_id: number;
    share_date: Date;
    share_url: string | null;
    created: Date;
    updated: Date;
}

export interface sweep_entry {
    sweep_entry_id: number;
    user_sweep_id: number;
    entry_date: Date;
    created: Date;
    updated: Date;
}

export interface user_sweep {
    user_sweep_id: number;
    user_account_id: AAGUID;
    sweep_id: number | null;
    sweep_name: string | null;
    sweep_url: string | null;
    end_date: Date;
    is_frequency: boolean | null;
    frequency_url: string | null;
    frequency_days: number | null;
    last_entry_date: Date | null;
    total_entries: number | null;
    is_referral: boolean | null;
    referral_url: string | null;
    total_shares: number | null;
    referral_frequency: number | null;
    personal_refer_message: string | null;
    last_facebook_share: Date | null;
    last_twitter_share: Date | null;
    last_google_share: Date | null;
    last_linkedin_share: Date | null;
    last_pinterest_share: Date | null;
    thanks_to: string | null;
    thanks_social_media_id: number | null;
    won_yn: boolean | null;
    prize_value: number | null;
    deleted_yn: boolean | null;
    created: Date;
    updated: Date;
}

export interface user_social_extra {
    user_social_extra_id: number;
    user_account_id: AAGUID;
    social_media_field_id: number;
    social_media_id: number;
    social_media_field_value: string | null;
    created: Date;
    updated: Date;
}

export interface log {
    log_id: number;
    log_date: Date;
    user_account_id: AAGUID;
    log_action_id: number;
    parameters: string | null;
    error: string | null;
    created: Date;
    updated: Date;
}

export interface payment {
    payment_id: number;
    user_account_id: AAGUID;
    payment_package_id: number;
    amount_paid: number;
    payment_date: Date;
    paid_until: Date;
    created: Date;
    updated: Date;
}

export interface social_media_field {
    social_media_field_id: number;
    social_media_field_name: string;
    is_token_yn: boolean | null;
    created: Date;
    updated: Date;
}

export interface facebook_account {
    facebook_account_id: string;
    user_account_id: AAGUID | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    photo_url: string | null;
    auth_token: string | null;
    id_token: string | null;
    expiration_date: Date | null;
    auth_error: string | null;
    created: Date;
    updated: Date;
}

export interface google_account {
    google_account_id: string;
    user_account_id: AAGUID | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    photo_url: string | null;
    auth_token: string | null;
    id_token: string | null;
    expiration_date: Date | null;
    auth_error: string | null;
    created: Date;
    updated: Date;
}

export interface user_account {
    user_account_id: AAGUID;
    first_name: string | null;
    last_name: string | null;
    is_deleted: boolean;
    email: string | null;
    hashed_password: string | null;
    photo_url: string | null;
    created: Date;
    updated: Date;
}

export interface social_media {
    social_media_id: number;
    social_media_name: string;
    created: Date;
    updated: Date;
}

export interface log_action {
    log_action_id: number;
    log_action_name: string;
    created: Date;
    updated: Date;
}

export interface payment_package {
    payment_package_id: number;
    payment_package_name: string;
    max_active_sweeps: number | null;
    is_lifetime: boolean | null;
    price: number;
    expire_date: Date | null;
    created: Date;
    updated: Date;
}

export interface retired_user_account {
    user_account_id: AAGUID;
    first_name: string | null;
    last_name: string | null;
    is_deleted: boolean;
    replacement_user_account_id: AAGUID | null;
    created: Date;
    updated: Date;
}
