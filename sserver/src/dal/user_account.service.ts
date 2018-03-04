import { DbGetter } from './DbGetter';
import { BaseService } from './base.service';
import { user_account, retired_user_account } from './DB';
import { SocialUserAndAccount, Account } from './SocialUserAndAccount';
import { promise } from 'selenium-webdriver';

export class UserAccountService extends BaseService<user_account> {
    constructor() {
        super('user_account');
    }

    async CookieLogin(user_account: Account): Promise<user_account> {
        const db = DbGetter.getDB();
        return db.task('cookie-login', db => {
            return this.CookieLoginInner(db, user_account);
        });
    }
    
    async CookieLoginInner(DB, user_account: Account): Promise<user_account>{
        let q =
            `SELECT user_account.*\n` +
            `  FROM sweepimp.user_account\n` +
            ` WHERE user_account_id = $<user_account_id^>;\n` +
            `SELECT retired_user_account.*\n` +
            `  FROM sweepimp.retired_user_account\n` +
            ` WHERE user_account_id = $<user_account_id^>`;
        var UserAccounts = await DB.multi(q, {user_account_id: user_account.user_account_id});
        while(!UserAccounts[0][0]){
            UserAccounts = await DB.multi(q, {user_account_id: UserAccounts[1][0].replacement_user_account_id});
        }
        return UserAccounts[0][0];
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
            const loginUser = await db.oneOrNone<user_account>(q, social_media_account);
            var now = new Date();
            if (loginUser !== null) { // social media user exists
                if (!social_media_account.user_account_id || loginUser.user_account_id === social_media_account.user_account_id) {
                // Cookie matches social media user or no cookie
                    return loginUser;
                } else {
                    // Cookie exists, but social media user does not match cookie. SHIT! Merge user accounts?
                    // first, let's get the cookie user. notice the filter is on user_account_id, not on id (social media's user id) as before
                    q = `SELECT user_account.*\n` +
                        `  FROM sweepimp.user_account\n` +
                        ` WHERE user_account_id = $<user_account_id^>`;
                    const cookieUser = await db.oneOrNone<user_account>(q, social_media_account);
                    const validProviders = ['facebook', 'google'];
                    const two_minutes = 2 * 60 * 1000;
                    if (now.getTime() - cookieUser.created.getTime() <= two_minutes) {
                        // Cookie user was created recentley, probably due to login screen press order. Do a simple merge
                        return this.Merge(cookieUser, loginUser, provider, validProviders, true);
                    } else {
                        // Two users were active for some time. Complicated merge?
                        const CommonSocialMedias = await this.GetOverlappingSocialMedias(db, cookieUser, loginUser, validProviders, provider);
                        if (CommonSocialMedias.length){
                            throw new Error(`This ${provider} user is already connected to another ${CommonSocialMedias} profile`);
                        } else {
                            return (cookieUser.created > loginUser.created ? // merge newer account into older account
                                this.Merge(cookieUser, loginUser, provider, validProviders, false)
                                :
                                this.Merge(loginUser, cookieUser, provider, validProviders, false)
                            );
                        }
                    }
                }
            } else { // new social user
                const txName = social_media_account.user_account_id ? 'new-social-user' : 'new-user';
                return db.tx(txName, db => {
                    return this.CreateSocialUser(db, social_media_account, provider, !social_media_account.user_account_id);  
                });
            }
        } catch (error) {
            console.log('failed to query db', error);
        }
    }

    async GetOverlappingSocialMedias(DB, cookieUser: user_account, loginUser: user_account, validProviders: string[], provider: string): Promise<string[]>{
        var SocialMediaExistsForCookieUser;
        var SocialMediaExistsForLoginUser;
        var CommonSocialMedias = [];
        for (let i_Provider of validProviders){
            if (i_Provider != provider){
/*                let q = 
                    `SELECT COUNT(*)\n` +
                    `  FROM sweepimp.${i_Provider}_account\n` +
                    ` WHERE user_account_id = $<user_account_id^>`;
                await promise.all([DB.one(q, cookieUser), DB.one(q, loginUser)]).then(values => {
                    if (values[0].count > 0 && values[1].count > 0){
                        CommonSocialMedias.push(i_Provider);
                    }
                });*/
                let q =
                `SELECT COUNT(*)\n` +
                `  FROM sweepimp.${i_Provider}_account\n` +
                ` WHERE user_account_id = $<cookie_user_account_id^>;\n` +
                `SELECT COUNT(*)\n` +
                `  FROM sweepimp.${i_Provider}_account\n` +
                ` WHERE user_account_id = $<login_user_account_id^>`;
                await DB.multi(q,{cookie_user_account_id: cookieUser.user_account_id, login_user_account_id: loginUser.user_account_id})
                    .then(values => {
                        if (values[0][0].count > 0 && values[1][0].count > 0){
                            CommonSocialMedias.push(i_Provider);
                        }
                    });
            }
        }
        return CommonSocialMedias;
    }

    async Merge(source: user_account, target: user_account, Provider: string, validProviders: string[], isSimple: boolean): Promise<user_account> {
        const db = DbGetter.getDB();
        const mergeType = (isSimple ? 'simple' : 'complicated');
        var TablesToUpdate = (isSimple ? [] : ['user_sweep_display', 'user_sweep', 'user_social_extra', 'payment']);
        for (let i_Provider of validProviders){
            TablesToUpdate.push(i_Provider + '_account');
        }
        await db.tx(mergeType + '-merge', merge => {
            return this.MergeInner(merge, source, target, TablesToUpdate);
        });
        return target;
    }

    async MergeInner(merge, source: user_account, target: user_account, TablesToUpdate: string[]) {
        
        let q =
            `UPDATE sweepimp.$<table_name:name>\n` +
            `   SET user_account_id = $<user_account_id_target^>\n` +
            ` WHERE user_account_id = $<user_account_id_source^>`;
        /*
        for (let element of TablesToUpdate) {
            const data = merge.none(q, {
                table_name: element,
                user_account_id_source: source.user_account_id,
                user_account_id_target: target.user_account_id,
            });
        };
        */
        let updates = [];
        for (let element of TablesToUpdate) {
            updates.push(merge.none(q, {
                table_name: element,
                user_account_id_source: source.user_account_id,
                user_account_id_target: target.user_account_id,
            }));
        };
        await promise.all(updates);
        
        q = `INSERT INTO sweepimp.retired_user_account\n` +
            `    (user_account_id, first_name, last_name, replacement_user_account_id, created, updated)\n` +
            `SELECT user_account_id, first_name, last_name, $<user_account_id_target^>, created, current_timestamp\n` +
            `  FROM sweepimp.user_account\n` +
            ` WHERE user_account_id = $<user_account_id_source^>`;
        merge.none(q, {
            user_account_id_source: source.user_account_id,
            user_account_id_target: target.user_account_id,
        });
        q = `DELETE FROM sweepimp.user_account\n` +
            ` WHERE user_account_id = $<user_account_id^>`;
        await merge.none(q, source);
    }

    async CreateSocialUser(DB, social_media_account: SocialUserAndAccount, Provider: string, CreateUserAccount: boolean): Promise<user_account> {
        const InsertUserAccount =
            `INSERT INTO sweepimp.user_account\n` +
            `    (first_name, last_name, created, updated)\n` +
            `VALUES\n` +
            `    ($<firstName>\n` +
            `    ,$<lastName>\n` +
            `    ,current_timestamp\n` +
            `    ,current_timestamp)\n` +
            `RETURNING *`;
            const SelectUserAccount = 
            `SELECT user_account.*\n` +
            `  FROM sweepimp.user_account\n` +
            ` WHERE user_account_id = $<user_account_id^>`;
        var q = (CreateUserAccount ? InsertUserAccount : SelectUserAccount);
        const UserAccount = await DB.one(q, social_media_account);
        social_media_account.user_account_id = UserAccount.user_account_id;
        q = `INSERT INTO sweepimp.${Provider}_account\n` +
            `    (${Provider}_account_id, user_account_id, first_name, last_name, email, photo_url, auth_token, id_token, created, updated)\n` +
            `VALUES\n` +
            `    ($<id>\n` +
            `    ,$<user_account_id^>\n` +
            `    ,$<firstName>\n` +
            `    ,$<lastName>\n` +
            `    ,$<email>\n` +
            `    ,$<photoUrl>\n` +
            `    ,$<authToken>\n` +
            (Provider == 'google' ?
            `    ,$<idToken>\n` 
            :
            `    ,NULL\n`
            ) +
            `    ,current_timestamp\n` +
            `    ,current_timestamp)`;
        DB.none(q, social_media_account);
        return UserAccount;
    }
}