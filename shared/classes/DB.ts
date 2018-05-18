/* tslint:disable */


/**
 * AUTO-GENERATED FILE @ 2018-02-23 01:12:50 - DO NOT EDIT!
 *
 * This file was automatically generated by schemats v.3.0.3
schemats generate -c postgres://hsrbfqoh:OASQR0O7qDLnHlIBgWcHiD_dKwz4dBoM@hard-plum.db.elephantsql.com:5432/hsrbfqoh -s sweepimp -o DB1.ts -t user_sweep_display -t sweep_share -t sweep_entry
schemats generate -c postgres://hsrbfqoh:OASQR0O7qDLnHlIBgWcHiD_dKwz4dBoM@hard-plum.db.elephantsql.com:5432/hsrbfqoh -s sweepimp -o DB2.ts -t user_sweep -t user_social_extra -t log
schemats generate -c postgres://hsrbfqoh:OASQR0O7qDLnHlIBgWcHiD_dKwz4dBoM@hard-plum.db.elephantsql.com:5432/hsrbfqoh -s sweepimp -o DB3.ts -t payment -t social_media_field -t facebook_account
schemats generate -c postgres://hsrbfqoh:OASQR0O7qDLnHlIBgWcHiD_dKwz4dBoM@hard-plum.db.elephantsql.com:5432/hsrbfqoh -s sweepimp -o DB4.ts -t google_account -t user_account -t social_media
schemats generate -c postgres://hsrbfqoh:OASQR0O7qDLnHlIBgWcHiD_dKwz4dBoM@hard-plum.db.elephantsql.com:5432/hsrbfqoh -s sweepimp -o DB5.ts -t log_action -t payment_package -t retired_user_account
 *
 */


export namespace user_sweep_displayFields {
    export type user_sweep_id = number;
    export type user_account_id = number;
    export type sweep_name = string | null;
    export type sweep_url = string | null;
    export type end_date = Date;
    export type is_frequency = boolean | null;
    export type frequency_url = string | null;
    export type frequency_days = number | null;
    export type last_entry_date = Date | null;
    export type total_entries = number | null;
    export type is_referral = boolean | null;
    export type referral_url = string | null;
    export type total_shares = number | null;
    export type thanks_to = string | null;
    export type thanks_social_media_id = number | null;
    export type won_yn = boolean | null;
    export type deleted_yn = boolean | null;
    export type created = Date;
    export type updated = Date;

}

export interface user_sweep_display {
    user_sweep_id: user_sweep_displayFields.user_sweep_id;
    user_account_id: user_sweep_displayFields.user_account_id;
    sweep_name: user_sweep_displayFields.sweep_name;
    sweep_url: user_sweep_displayFields.sweep_url;
    end_date: user_sweep_displayFields.end_date;
    is_frequency: user_sweep_displayFields.is_frequency;
    frequency_url: user_sweep_displayFields.frequency_url;
    frequency_days: user_sweep_displayFields.frequency_days;
    last_entry_date: user_sweep_displayFields.last_entry_date;
    total_entries: user_sweep_displayFields.total_entries;
    is_referral: user_sweep_displayFields.is_referral;
    referral_url: user_sweep_displayFields.referral_url;
    total_shares: user_sweep_displayFields.total_shares;
    thanks_to: user_sweep_displayFields.thanks_to;
    thanks_social_media_id: user_sweep_displayFields.thanks_social_media_id;
    won_yn: user_sweep_displayFields.won_yn;
    deleted_yn: user_sweep_displayFields.deleted_yn;
    created: user_sweep_displayFields.created;
    updated: user_sweep_displayFields.updated;

}

export namespace sweep_shareFields {
    export type sweep_share_id = number;
    export type user_sweep_id = number;
    export type social_media_id = number;
    export type share_date = Date;
    export type share_url = string | null;
    export type created = Date;
    export type updated = Date;

}

export interface sweep_share {
    sweep_share_id: sweep_shareFields.sweep_share_id;
    user_sweep_id: sweep_shareFields.user_sweep_id;
    social_media_id: sweep_shareFields.social_media_id;
    share_date: sweep_shareFields.share_date;
    share_url: sweep_shareFields.share_url;
    created: sweep_shareFields.created;
    updated: sweep_shareFields.updated;

}

export namespace sweep_entryFields {
    export type sweep_entry_id = number;
    export type user_sweep_id = number;
    export type entry_date = Date;
    export type created = Date;
    export type updated = Date;

}

export interface sweep_entry {
    sweep_entry_id: sweep_entryFields.sweep_entry_id;
    user_sweep_id: sweep_entryFields.user_sweep_id;
    entry_date: sweep_entryFields.entry_date;
    created: sweep_entryFields.created;
    updated: sweep_entryFields.updated;

}

export namespace user_sweepFields {
    export type user_sweep_id = number;
    export type user_account_id = number;
    export type sweep_id = number | null;
    export type sweep_name = string | null;
    export type sweep_url = string | null;
    export type end_date = Date;
    export type is_frequency = boolean | null;
    export type frequency_url = string | null;
    export type frequency_days = number | null;
    export type is_referral = boolean | null;
    export type referral_url = string | null;
    export type referral_frequency = number | null;
    export type personal_refer_message = string | null;
    export type refer_facebook = boolean | null;
    export type refer_twitter = boolean | null;
    export type refer_google = boolean | null;
    export type refer_linkedin = boolean | null;
    export type refer_pinterest = boolean | null;
    export type thanks_to = string | null;
    export type thanks_social_media_id = number | null;
    export type won_yn = boolean | null;
    export type prize_value = number | null;
    export type deleted_yn = boolean | null;
    export type created = Date;
    export type updated = Date;

}

export interface user_sweep {
    user_sweep_id: user_sweepFields.user_sweep_id;
    user_account_id: user_sweepFields.user_account_id;
    sweep_id: user_sweepFields.sweep_id;
    sweep_name: user_sweepFields.sweep_name;
    sweep_url: user_sweepFields.sweep_url;
    end_date: user_sweepFields.end_date;
    is_frequency: user_sweepFields.is_frequency;
    frequency_url: user_sweepFields.frequency_url;
    frequency_days: user_sweepFields.frequency_days;
    is_referral: user_sweepFields.is_referral;
    referral_url: user_sweepFields.referral_url;
    referral_frequency: user_sweepFields.referral_frequency;
    personal_refer_message: user_sweepFields.personal_refer_message;
    refer_facebook: user_sweepFields.refer_facebook;
    refer_twitter: user_sweepFields.refer_twitter;
    refer_google: user_sweepFields.refer_google;
    refer_linkedin: user_sweepFields.refer_linkedin;
    refer_pinterest: user_sweepFields.refer_pinterest;
    thanks_to: user_sweepFields.thanks_to;
    thanks_social_media_id: user_sweepFields.thanks_social_media_id;
    won_yn: user_sweepFields.won_yn;
    prize_value: user_sweepFields.prize_value;
    deleted_yn: user_sweepFields.deleted_yn;
    created: user_sweepFields.created;
    updated: user_sweepFields.updated;

}

export namespace user_social_extraFields {
    export type user_social_extra_id = number;
    export type user_account_id = number;
    export type social_media_field_id = number;
    export type social_media_id = number;
    export type social_media_field_value = string | null;
    export type created = Date;
    export type updated = Date;

}

export interface user_social_extra {
    user_social_extra_id: user_social_extraFields.user_social_extra_id;
    user_account_id: user_social_extraFields.user_account_id;
    social_media_field_id: user_social_extraFields.social_media_field_id;
    social_media_id: user_social_extraFields.social_media_id;
    social_media_field_value: user_social_extraFields.social_media_field_value;
    created: user_social_extraFields.created;
    updated: user_social_extraFields.updated;

}

export namespace logFields {
    export type log_id = number;
    export type log_date = Date;
    export type user_account_id = number;
    export type log_action_id = number;
    export type parameters = string | null;
    export type error = string | null;
    export type created = Date;
    export type updated = Date;

}

export interface log {
    log_id: logFields.log_id;
    log_date: logFields.log_date;
    user_account_id: logFields.user_account_id;
    log_action_id: logFields.log_action_id;
    parameters: logFields.parameters;
    error: logFields.error;
    created: logFields.created;
    updated: logFields.updated;

}

export namespace paymentFields {
    export type payment_id = number;
    export type user_account_id = number;
    export type payment_package_id = number;
    export type amount_paid = number;
    export type payment_date = Date;
    export type paid_until = Date;
    export type created = Date;
    export type updated = Date;

}

export interface payment {
    payment_id: paymentFields.payment_id;
    user_account_id: paymentFields.user_account_id;
    payment_package_id: paymentFields.payment_package_id;
    amount_paid: paymentFields.amount_paid;
    payment_date: paymentFields.payment_date;
    paid_until: paymentFields.paid_until;
    created: paymentFields.created;
    updated: paymentFields.updated;

}

export namespace social_media_fieldFields {
    export type social_media_field_id = number;
    export type social_media_field_name = string;
    export type is_token_yn = boolean | null;
    export type created = Date;
    export type updated = Date;

}

export interface social_media_field {
    social_media_field_id: social_media_fieldFields.social_media_field_id;
    social_media_field_name: social_media_fieldFields.social_media_field_name;
    is_token_yn: social_media_fieldFields.is_token_yn;
    created: social_media_fieldFields.created;
    updated: social_media_fieldFields.updated;

}

export namespace facebook_accountFields {
    export type facebook_account_id = string;
    export type user_account_id = number | null;
    export type first_name = string | null;
    export type last_name = string | null;
    export type email = string | null;
    export type photo_url = string | null;
    export type auth_token = string | null;
    export type id_token = string | null;
    export type expiration_date = Date | null;
    export type auth_error = string | null;
    export type created = Date;
    export type updated = Date;

}

export interface facebook_account {
    facebook_account_id: facebook_accountFields.facebook_account_id;
    user_account_id: facebook_accountFields.user_account_id;
    first_name: facebook_accountFields.first_name;
    last_name: facebook_accountFields.last_name;
    email: facebook_accountFields.email;
    photo_url: facebook_accountFields.photo_url;
    auth_token: facebook_accountFields.auth_token;
    id_token: facebook_accountFields.id_token;
    expiration_date: facebook_accountFields.expiration_date;
    auth_error: facebook_accountFields.auth_error;
    created: facebook_accountFields.created;
    updated: facebook_accountFields.updated;

}

export namespace google_accountFields {
    export type google_account_id = string;
    export type user_account_id = number | null;
    export type first_name = string | null;
    export type last_name = string | null;
    export type email = string | null;
    export type photo_url = string | null;
    export type auth_token = string | null;
    export type id_token = string | null;
    export type expiration_date = Date | null;
    export type auth_error = string | null;
    export type created = Date;
    export type updated = Date;

}

export interface google_account {
    google_account_id: google_accountFields.google_account_id;
    user_account_id: google_accountFields.user_account_id;
    first_name: google_accountFields.first_name;
    last_name: google_accountFields.last_name;
    email: google_accountFields.email;
    photo_url: google_accountFields.photo_url;
    auth_token: google_accountFields.auth_token;
    id_token: google_accountFields.id_token;
    expiration_date: google_accountFields.expiration_date;
    auth_error: google_accountFields.auth_error;
    created: google_accountFields.created;
    updated: google_accountFields.updated;

}

export namespace user_accountFields {
    export type user_account_id = number;
    export type first_name = string | null;
    export type last_name = string | null;
    export type created = Date;
    export type updated = Date;

}

export interface user_account {
    user_account_id: user_accountFields.user_account_id;
    first_name: user_accountFields.first_name;
    last_name: user_accountFields.last_name;
    created: user_accountFields.created;
    updated: user_accountFields.updated;
    expiredSocialMedias?: string[];

}

export namespace social_mediaFields {
    export type social_media_id = number;
    export type social_media_name = string;
    export type created = Date;
    export type updated = Date;

}

export interface social_media {
    social_media_id: social_mediaFields.social_media_id;
    social_media_name: social_mediaFields.social_media_name;
    created: social_mediaFields.created;
    updated: social_mediaFields.updated;

}

export namespace log_actionFields {
    export type log_action_id = number;
    export type log_action_name = string;
    export type created = Date;
    export type updated = Date;

}

export interface log_action {
    log_action_id: log_actionFields.log_action_id;
    log_action_name: log_actionFields.log_action_name;
    created: log_actionFields.created;
    updated: log_actionFields.updated;

}

export namespace payment_packageFields {
    export type payment_package_id = number;
    export type payment_package_name = string;
    export type max_daily_sweeps = number | null;
    export type max_monthly_live_sweeps = number | null;
    export type is_lifetime = boolean | null;
    export type price = number;
    export type expire_date = Date | null;
    export type created = Date;
    export type updated = Date;

}

export interface payment_package {
    payment_package_id: payment_packageFields.payment_package_id;
    payment_package_name: payment_packageFields.payment_package_name;
    max_daily_sweeps: payment_packageFields.max_daily_sweeps;
    max_monthly_live_sweeps: payment_packageFields.max_monthly_live_sweeps;
    is_lifetime: payment_packageFields.is_lifetime;
    price: payment_packageFields.price;
    expire_date: payment_packageFields.expire_date;
    created: payment_packageFields.created;
    updated: payment_packageFields.updated;

}

export namespace retired_user_accountFields {
    export type user_account_id = number;
    export type first_name = string | null;
    export type last_name = string | null;
    export type replacement_user_account_id = number | null;
    export type created = Date;
    export type updated = Date;

}

export interface retired_user_account {
    user_account_id: retired_user_accountFields.user_account_id;
    first_name: retired_user_accountFields.first_name;
    last_name: retired_user_accountFields.last_name;
    replacement_user_account_id: retired_user_accountFields.replacement_user_account_id
    created: retired_user_accountFields.created;
    updated: retired_user_accountFields.updated;

}
