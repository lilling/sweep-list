import { DbGetter } from './DbGetter';
import { BaseService } from './base.service';
import { user_account, google_account } from './DB';
import { SocialUserAndAccount } from './SocialUserAndAccount';

export class UserAccountService extends BaseService<user_account> {
    constructor() {
        super('user_account');
    }

    async Merge(source: user_account, target: user_account, Provider: string, isSimple: boolean): Promise<user_account> {
        const db = DbGetter.getDB();
        const mergeType = (isSimple ? 'simple' : 'complicated');
        const validProviders = ['facebook', 'google'];
        var TablesToUpdate = (isSimple ? [] : ['user_sweep_display', 'user_sweep', 'user_social_extra', 'payment']);
        for (let i_Provider of validProviders){
            if (i_Provider !== Provider){
                TablesToUpdate.push(i_Provider + '_account');
            }
        }
        try {
            await db.tx(mergeType + '-merge', merge => {
                return this.MergeInner(merge, source, target, TablesToUpdate);
            });
            return target;
        } catch (error) {
            console.log('failed to query db', error);
        }
    }

    async MergeInner(merge, source: user_account, target: user_account, TablesToUpdate: string[]) {
        let q =
            `UPDATE sweepimp.$<table_name:name>\n` +
            `   SET user_account_id = $<user_account_id_target>\n` +
            ` WHERE user_account_id = $<user_account_id_source>`;
        for (let element of TablesToUpdate) {
            const data = await merge.none(q, {
                table_name: element,
                user_account_id_source: source.user_account_id,
                user_account_id_target: target.user_account_id,
            });
        };
        // insert: retired_user_account
        q = `INSERT INTO sweepimp.retired_user_account\n` +
            `    (user_account_id, first_name, last_name, replacement_user_account_id, created, updated)\n` +
            `SELECT user_account_id, first_name, last_name, $<user_account_id_target>, created, current_timestamp\n` +
            `  FROM sweepimp.user_account\n` +
            ` WHERE user_account_id = $<user_account_id_source>`;
        merge.none(q, {
            user_account_id_source: source.user_account_id,
            user_account_id_target: target.user_account_id,
        });
        q = `DELETE FROM sweepimp.user_account\n` +
            ` WHERE user_account_id = $<user_account_id>`;
        await merge.none(q, source);
    }

    async SocialMediaLogin(social_media_account: SocialUserAndAccount): Promise<user_account> {
        const db = DbGetter.getDB();
        const provider = social_media_account.provider.toLowerCase();
        let q =
            `SELECT user_account.*\n` +
            `  FROM sweepimp.${provider}_account\n` +
            `  JOIN sweepimp.user_account using (user_account_id)\n` +
            ` WHERE ${provider}_account_id = $<id>`;
        try {
            const data = await db.oneOrNone<user_account>(q, social_media_account);
            var now = new Date();
            if (data !== null) { // social media user exists
                if (!social_media_account.user_account_id || data.user_account_id === social_media_account.user_account_id) {
                    // No cookie, or cookie matches social media user (= manage social media screen)
                    return data;
                } else {
                    // Cookie exists, but social media user does not match cookie. SHIT! Merge user accounts?
                    // first, let's get the cookie user. notice the filter is on user_account_id, not on id (social media's user id) as before
                    q = `SELECT user_account.*\n` +
                        `  FROM sweepimp.user_account\n` +
                        ` WHERE user_account_id = $<user_account_id>`;
                    const cookie_data = await db.oneOrNone<user_account>(q, social_media_account);
                    const five_minutes = 5 * 60 * 1000;
                    if (now.getTime() - cookie_data.created.getTime() <= five_minutes) {
                        // Cookie user was created recentley, probably login screen press order. Do a simple merge
                        return this.Merge(cookie_data, data, provider, true);
                    } else {
                        // Two users were active for some time. Complicated merge?
                        // Check if there are overlapping social medias
                        q =
                            `SELECT COUNT(*)\n` +
                            `  FROM sweepimp.${provider}_account\n` +
                            ` WHERE user_account_id = $<user_account_id>`;
                        const cookieFBExists = await db.one(q, { user_account_id: cookie_data.user_account_id });
                        // const dataFBExists = await db.one(q, {user_account_id: data.user_account_id}); // no need, we know the login
                        // was from FB
                        if (cookieFBExists.count > 0) {
                            throw new Error(`User already looged on to ${provider} with another profile!`); // Change to provider
                        } else {
                            return this.Merge(cookie_data, data, provider, false);
                        }
                    }
                }
            } else { // new social user
                if (social_media_account.user_account_id) { // Cookie exists, create FB user on existing user_account_id
// TODO: swap query order so we know user_account_id record exists before inserting to social media table. Make sure function returns the user_account_id record (just switching places does not help).
                    return db.task('new-social-user', t => {
                        q = `INSERT INTO sweepimp.${provider}_account\n` +
                            `    (${provider}_account_id, user_account_id, first_name, last_name, email, photo_url, created, updated)\n` +
                            `VALUES\n` +
                            `    ($<id>\n` +
                            `    ,$<user_account_id>\n` +
                            `    ,$<firstName>\n` +
                            `    ,$<lastName>\n` +
                            `    ,$<email>\n` +
                            `    ,$<photoUrl>\n` +
                            `    ,current_timestamp\n` +
                            `    ,current_timestamp)`;
                        return t.none(q, social_media_account)
                            .then(() => {
                                q = `SELECT user_account.*\n` +
                                    `  FROM sweepimp.user_account\n` +
                                    ` WHERE user_account_id = $<user_account_id>`;
                                return t.one(q, social_media_account);
                            });
                    });
                } else {// Cookie does not exist, completely new user. Create new user, FB user and relate them
                    return db.tx('new-user', t => {
                        q = `INSERT INTO sweepimp.user_account\n` +
                            `    (first_name, last_name, created, updated)\n` +
                            `VALUES\n` +
                            `    ($<firstName>\n` +
                            `    ,$<lastName>\n` +
                            `    ,current_timestamp\n` +
                            `    ,current_timestamp)\n` +
                            `RETURNING *`;
                        return t.one(q, social_media_account)
                            .then(user_account => {
                                q = `INSERT INTO sweepimp.${provider}_account\n` +
                                    `    (${provider}_account_id, user_account_id, first_name, last_name, email, photo_url, created, updated)\n` +
                                    `VALUES\n` +
                                    `    ($<id>\n` +
                                    `    ,${user_account.user_account_id}\n` +
                                    `    ,$<firstName>\n` +
                                    `    ,$<lastName>\n` +
                                    `    ,$<email>\n` +
                                    `    ,$<photoUrl>\n` +
                                    `    ,current_timestamp\n` +
                                    `    ,current_timestamp)`;
                                t.none(q, social_media_account);
                                return user_account;
                            });
                    });
                }
            }
        } catch (error) {
            console.log('failed to query db', error);
        }
    }
}