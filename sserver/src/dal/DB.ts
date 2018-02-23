/* tslint:disable */


/**
 * AUTO-GENERATED FILE @ 2018-02-23 01:12:50 - DO NOT EDIT!
 *
 * This file was automatically generated by schemats v.3.0.3
 * $ schemats generate -c postgres://username:password@hard-plum.db.elephantsql.com:5432/hsrbfqoh -t payment_package -t payment -t payment_package_usage -s sweepimp
 * $ schemats generate -c postgres://username:password@hard-plum.db.elephantsql.com:5432/hsrbfqoh -t log_action -t log -t social_media_field -s sweepimp
 * $ schemats generate -c postgres://username:password@hard-plum.db.elephantsql.com:5432/hsrbfqoh -t user_social -t sweep_entry -t sweep_share -s sweepimp
 * $ schemats generate -c postgres://username:password@hard-plum.db.elephantsql.com:5432/hsrbfqoh -t user_sweep -t user -t social_media -s sweepimp
 * $ schemats generate -c postgres://username:password@hard-plum.db.elephantsql.com:5432/hsrbfqoh -t user_sweep_display -s sweepimp
 *
 */


export namespace payment_packageFields {
    export type payment_package_id = number;
    export type payment_package_name = string;
    export type max_monthly_sweeps = number | null;
    export type max_monthly_shares = number | null;
    export type length_days = number | null;
    export type is_lifetime = boolean | null;
    export type expire_date = Date | null;
    export type created = Date;
    export type updated = Date;

}

export interface payment_package {
    payment_package_id: payment_packageFields.payment_package_id;
    payment_package_name: payment_packageFields.payment_package_name;
    max_monthly_sweeps: payment_packageFields.max_monthly_sweeps;
    max_monthly_shares: payment_packageFields.max_monthly_shares;
    length_days: payment_packageFields.length_days;
    is_lifetime: payment_packageFields.is_lifetime;
    expire_date: payment_packageFields.expire_date;
    created: payment_packageFields.created;
    updated: payment_packageFields.updated;

}

export namespace paymentFields {
    export type payment_id = number;
    export type user_id = number;
    export type payment_package_id = number;
    export type payment_date = Date;
    export type created = Date;
    export type updated = Date;

}

export interface payment {
    payment_id: paymentFields.payment_id;
    user_id: paymentFields.user_id;
    payment_package_id: paymentFields.payment_package_id;
    payment_date: paymentFields.payment_date;
    created: paymentFields.created;
    updated: paymentFields.updated;

}

export namespace payment_package_usageFields {
    export type payment_package_usage_id = number;
    export type payment_id = number;
    export type period_start_date = Date;
    export type period_end_date = Date | null;
    export type sweeps_cretated = number | null;
    export type shares_done = number | null;
    export type created = Date;
    export type updated = Date;

}

export interface payment_package_usage {
    payment_package_usage_id: payment_package_usageFields.payment_package_usage_id;
    payment_id: payment_package_usageFields.payment_id;
    period_start_date: payment_package_usageFields.period_start_date;
    period_end_date: payment_package_usageFields.period_end_date;
    sweeps_cretated: payment_package_usageFields.sweeps_cretated;
    shares_done: payment_package_usageFields.shares_done;
    created: payment_package_usageFields.created;
    updated: payment_package_usageFields.updated;

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

export namespace logFields {
    export type log_id = number;
    export type log_date = Date;
    export type user_id = number;
    export type log_action_id = number;
    export type parameters = string | null;
    export type error = string | null;
    export type created = Date;
    export type updated = Date;

}

export interface log {
    log_id: logFields.log_id;
    log_date: logFields.log_date;
    user_id: logFields.user_id;
    log_action_id: logFields.log_action_id;
    parameters: logFields.parameters;
    error: logFields.error;
    created: logFields.created;
    updated: logFields.updated;

}

export namespace social_media_fieldFields {
    export type social_media_field_id = number;
    export type social_media_field_name = string;
    export type created = Date;
    export type updated = Date;

}

export interface social_media_field {
    social_media_field_id: social_media_fieldFields.social_media_field_id;
    social_media_field_name: social_media_fieldFields.social_media_field_name;
    created: social_media_fieldFields.created;
    updated: social_media_fieldFields.updated;

}

export namespace user_socialFields {
    export type user_social_id = number;
    export type user_id = number;
    export type social_media_field_id = number;
    export type social_media_id = number;
    export type social_media_field_value = string | null;
    export type created = Date;
    export type updated = Date;

}

export interface user_social {
    user_social_id: user_socialFields.user_social_id;
    user_id: user_socialFields.user_id;
    social_media_field_id: user_socialFields.social_media_field_id;
    social_media_id: user_socialFields.social_media_id;
    social_media_field_value: user_socialFields.social_media_field_value;
    created: user_socialFields.created;
    updated: user_socialFields.updated;

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

export namespace user_sweepFields {
    export type user_sweep_id = number;
    export type user_id = number;
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
    export type created = Date;
    export type updated = Date;

}

export interface user_sweep {
    user_sweep_id: user_sweepFields.user_sweep_id;
    user_id: user_sweepFields.user_id;
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
    created: user_sweepFields.created;
    updated: user_sweepFields.updated;

}

export namespace userFields {
    export type user_id = number;
    export type first_name = string | null;
    export type last_name = string | null;
    export type created = Date;
    export type updated = Date;

}

export interface user {
    user_id: userFields.user_id;
    first_name: userFields.first_name;
    last_name: userFields.last_name;
    created: userFields.created;
    updated: userFields.updated;

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

export namespace user_sweep_displayFields {
    export type user_sweep_id = number;
    export type user_id = number;
    export type sweep_name = string | null;
    export type sweep_url = string | null;
    export type end_date = Date;
    export type is_frequency = boolean | null;
    export type frequency_url = string | null;
    export type last_entry_date = Date | null;
    export type total_entries = number | null;
    export type is_referral = boolean | null;
    export type referral_url = string | null;
    export type total_shares = number | null;
    export type thanks_to = string | null;
    export type thanks_social_media_id = number | null;
    export type won_yn = boolean | null;
    export type created = Date;
    export type updated = Date;

}

export interface user_sweep_display {
    user_sweep_id: user_sweep_displayFields.user_sweep_id;
    user_id: user_sweep_displayFields.user_id;
    sweep_name: user_sweep_displayFields.sweep_name;
    sweep_url: user_sweep_displayFields.sweep_url;
    end_date: user_sweep_displayFields.end_date;
    is_frequency: user_sweep_displayFields.is_frequency;
    frequency_url: user_sweep_displayFields.frequency_url;
    last_entry_date: user_sweep_displayFields.last_entry_date;
    total_entries: user_sweep_displayFields.total_entries;
    is_referral: user_sweep_displayFields.is_referral;
    referral_url: user_sweep_displayFields.referral_url;
    total_shares: user_sweep_displayFields.total_shares;
    thanks_to: user_sweep_displayFields.thanks_to;
    thanks_social_media_id: user_sweep_displayFields.thanks_social_media_id;
    won_yn: user_sweep_displayFields.won_yn;
    created: user_sweep_displayFields.created;
    updated: user_sweep_displayFields.updated;

}