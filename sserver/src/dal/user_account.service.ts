import { DbGetter } from './DbGetter';
import { BaseService } from './base.service';
import { user_account, facebook_account, google_account } from './DB';
import { SocialUserAndAccount } from './SocialUserAndAccount';

export class UserAccountService extends BaseService<user_account> {
    constructor() {
        super('user_account');
    }

// TO DO: why returns targrt when error?
    SimpleMerge(source: user_account, target: user_account): user_account{
        const db = DbGetter.getDB();
        try {
            db.tx('simple-merge', simple_merge => {
                var q = `UPDATE sweepimp.google_account\n` +
                        `   SET user_account_id = $<user_account_id_target>\n` +
                        ` WHERE user_account_id = $<user_account_id_source>`;
                return simple_merge.none(q, {
                    user_account_id_source: source.user_account_id,
                    user_account_id_target: target.user_account_id
                })
                    .then(del_user_account => {
                        q = `DELETE FROM sweepimp.user_account\n` +
                            ` WHERE user_account_id = $<user_account_id>`;
                        return simple_merge.none(q, source);
                    });
            });
            return target;
        } catch (error) {
            console.log('failed to query db', error);
        }
    }

// TO DO: why returns target when error?
    ComplicatedMerge(source: user_account, target: user_account): user_account{
        const db = DbGetter.getDB();
        const TablesToUpdate = ['user_sweep_display', 'user_sweep', 'user_social_extra', 'payment', 'google_account'];// facebook_account - for later
        var q = `UPDATE sweepimp.$<table_name:name>\n` +
                `   SET user_account_id = $<user_account_id_target>\n` +
                ` WHERE user_account_id = $<user_account_id_source>`;
        try {
            db.tx('complicated-merge', complicated_merge => {
                TablesToUpdate.forEach(element => {
                    complicated_merge.none(q, {
                        table_name: element,
                        user_account_id_source: source.user_account_id,
                        user_account_id_target: target.user_account_id
                    })
                });
                // insert: retired_user_account
                q = `INSERT INTO sweepimp.retired_user_account\n` +
                    `    (user_account_id, first_name, last_name, replacement_user_account_id, created, updated)\n` +
                    `SELECT user_account_id, first_name, last_name, $<user_account_id_target>, created, current_timestamp\n` +
                    `  FROM sweepimp.user_account\n` +
                    ` WHERE user_account_id = $<user_account_id_source>`;
                complicated_merge.none(q, {
                    user_account_id_source: source.user_account_id,
                    user_account_id_target: target.user_account_id
                });
                // delete: user_account
                q = `DELETE FROM sweepimp.user_account\n` +
                    ` WHERE user_account_id = $<user_account_id_source>`;
                complicated_merge.none(q, {
                    user_account_id_source: source.user_account_id
                });
            });
            return target;
        } catch (error) {
            console.log('failed to query db', error);
        }
    }

    async getUserByFB(id: string): Promise<user_account> {
        const db = DbGetter.getDB();
        const q = `SELECT user_account.*\n` +
                  `   FROM sweepimp.facebook_account\n` +
                  `  JOIN sweepimp.user_account using (user_account_id)\n` +
                  `  WHERE facebook_account_id = $<q_id>`;
        try {
            const data = await db.oneOrNone<user_account>(q, {q_id: id.toString()});
            return data;
        } catch (error) {
            console.log('failed to query db', error);
        }
    }

// TO DO: change to dynamic login provider
    async FacebookLogin(facebook_account: SocialUserAndAccount): Promise<user_account> {
        const db = DbGetter.getDB();
        var q = `SELECT user_account.*\n` +
                `  FROM sweepimp.facebook_account\n` +
                `  JOIN sweepimp.user_account using (user_account_id)\n` +
                ` WHERE facebook_account_id = $<id>`;
        try {
            const data = await db.oneOrNone<user_account>(q, facebook_account);
            if (data !== null){ // social media user exists
                if (!facebook_account.user_account_id || data.user_account_id == facebook_account.user_account_id){
                // No cookie, or cookie matches social media user (= manage social media screen)
                    return data;
                } else {
                // Cookie exists, but social media user does not match cookie. SHIT! Merge user accounts?
                // first, let's get the cookie user. notice the filter is on user_account_id, not on id (social media's user id) as before
                    q = `SELECT user_account.*\n` +
                        `  FROM sweepimp.user_account\n` +
                        ` WHERE user_account_id = $<user_account_id>`;
                    const cookie_data = await db.oneOrNone<user_account>(q, facebook_account);
                    const five_minutes = 5 * 60 * 1000;
                    const two_hours = 120 * 60 * 1000;
                    if(Date.now() - cookie_data.created.getTime() <= five_minutes + two_hours){
                    // Cookie user was created recentley, probably login screen press order. Do a simple merge
                        return this.SimpleMerge(cookie_data, data);
                    } else {
                    // Two users were active for some time. Complicated merge?
                    // Check if there are overlapping social medias
                        q = `SELECT COUNT(*) FROM sweepimp.facebook_account WHERE user_account_id = $<user_account_id>`;
                        const cookieFBExists = await db.one(q, {user_account_id: cookie_data.user_account_id});
                        //const dataFBExists = await db.one(q, {user_account_id: data.user_account_id}); // no need, we know the login was from FB
                        console.log('cookieFBExists.count: ' + cookieFBExists.count);
                        if (cookieFBExists.count > 0) {
                            throw new Error('Already looged on to Facebook with another profile!'); // Change to provider
                        } else {return this.ComplicatedMerge(cookie_data, data);}
                    }
                }
            } else { // new FB user
                if (facebook_account.user_account_id){ // Cookie exists, create FB user on existing user_account_id
// TO DO: swap query order so we know user_account_id record exists before inserting to social media table. Make sure function returns the user_account_id record (just switching places does not help).
                    return db.task('new-FB-user', t => {
                        q = `INSERT INTO sweepimp.facebook_account\n` +
                            `    (facebook_account_id, user_account_id, first_name, last_name, email, photo_url, created, updated)\n` +
                            `VALUES\n` +
                            `    ($<id>\n` +
                            `    ,$<user_account_id>\n` +
                            `    ,$<firstName>\n` +
                            `    ,$<lastName>\n` +
                            `    ,$<email>\n` +
                            `    ,$<photoUrl>\n` +
                            `    ,current_timestamp\n` +
                            `    ,current_timestamp)`;
                        return t.none(q, facebook_account)
                            .then(user_account => {
                                q = `SELECT user_account.*\n` +
                                    `  FROM sweepimp.user_account\n` +
                                    ` WHERE user_account_id = $<user_account_id>`;
                                return t.one(q, facebook_account);
                            });
                    })
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
                        return t.one(q, facebook_account)
                            .then(user_account => {
                                q = `INSERT INTO sweepimp.facebook_account\n` +
                                    `    (facebook_account_id, user_account_id, first_name, last_name, email, photo_url, created, updated)\n` +
                                    `VALUES\n` +
                                    `    ($<id>\n` +
                                    `    ,${user_account.user_account_id}\n` +
                                    `    ,$<firstName>\n` +
                                    `    ,$<lastName>\n` +
                                    `    ,$<email>\n` +
                                    `    ,$<photoUrl>\n` +
                                    `    ,current_timestamp\n` +
                                    `    ,current_timestamp)`;
                                t.none(q, facebook_account);
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