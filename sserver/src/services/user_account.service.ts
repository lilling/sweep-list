import { DbGetter } from '../dal/DbGetter';
import { BaseService } from './base.service';
import { user_account, SocialUserAndAccount } from '../../../shared/classes';
import { FacebookExtention } from '../../classes';
import { FacebookService } from './facebook.service'

export class UserAccountService extends BaseService<user_account> {
    validProviders = ['facebook', 'google'];
    FacebookService: FacebookService;

    constructor() {
        super('user_account');
        this.FacebookService = new FacebookService();
    }

    async CookieLogin(id: number): Promise<user_account> {
        const db = DbGetter.getDB();
        return db.task('cookie-login', innerDb => {
            return this.CookieLoginInner(innerDb, id);
        });
    }

    async CookieLoginInner(DB, id: number): Promise<user_account> {
        const q =
            `SELECT user_account.*\n` +
            `  FROM sweepimp.user_account\n` +
            ` WHERE user_account_id = $<user_account_id^>;\n` +
            `SELECT retired_user_account.*\n` +
            `  FROM sweepimp.retired_user_account\n` +
            ` WHERE user_account_id = $<user_account_id^>`;
        let UserAccounts = await DB.multi(q, { user_account_id: id });
        while (!UserAccounts[0][0]) {
            UserAccounts = await DB.multi(q, { user_account_id: UserAccounts[1][0].replacement_user_account_id });
        }
        return UserAccounts[0][0];
    }

    async GetSocialMedia(id: number): Promise<string[]> {
        const db = DbGetter.getDB();
        const SocialMedias = [];
        for (const i_Provider of this.validProviders) {
            const q =
                `SELECT COUNT(*)\n` +
                `  FROM sweepimp.${i_Provider}_account\n` +
                ` WHERE user_account_id = $<id^>`;
            await db.oneOrNone(q, { id })
                .then(values => {
                    if (values.count > 0) {
                        SocialMedias.push(i_Provider);
                    }
                });
        }
        return SocialMedias;
    }

    async SocialMediaLogin(social_media_account_param: SocialUserAndAccount): Promise<user_account> {
        const social_media_account = new SocialUserAndAccount(social_media_account_param);
        const db = DbGetter.getDB();
        const provider = social_media_account.provider.toLowerCase();
        let q =
            `SELECT user_account.*\n` +
            `  FROM sweepimp.${provider}_account\n` +
            `  JOIN sweepimp.user_account using (user_account_id)\n` +
            ` WHERE ${provider}_account_id = $<id>`;
        try {
            const loginUser = await db.oneOrNone<user_account>(q, social_media_account);
            const now = new Date();
            if (loginUser !== null) { // social media user exists
                if (!social_media_account.user_account_id || loginUser.user_account_id === social_media_account.user_account_id) {
                    // Cookie matches social media user or no cookie
                    q = `UPDATE sweepimp.${provider}_account\n` +
                        `   SET auth_token = $<authToken>\n` +
                        `      ,updated = current_timestamp\n` +
                        ` WHERE ${provider}_account_id = $<id>`;
                        db.none(q, social_media_account);
                    return loginUser;
                } else {
                    // Cookie exists, but social media user does not match cookie. SHIT! Merge user accounts?
                    // first, let's get the cookie user. notice the filter is on user_account_id, not on id (social media's user id) as before
                    q = `SELECT user_account.*\n` +
                        `  FROM sweepimp.user_account\n` +
                        ` WHERE user_account_id = $<user_account_id^>`;
                    const cookieUser = await db.oneOrNone<user_account>(q, social_media_account);
                    const two_minutes = 2 * 60 * 1000;
                    if (now.getTime() - cookieUser.created.getTime() <= two_minutes) {
                        // Cookie user was created recently, probably due to login screen press order. Do a simple merge
                        return this.Merge(cookieUser, loginUser, provider, true);
                    } else {
                        // Two users were active for some time. Complicated merge?
                        const CommonSocialMedias = await this.GetOverlappingSocialMedias(db, cookieUser, loginUser, provider);
                        if (CommonSocialMedias.length) {
                            throw new Error(`This ${provider} user is already connected to another ${CommonSocialMedias} profile`);
                        } else {
                            return (cookieUser.created > loginUser.created ? // merge newer account into older account
                                    this.Merge(cookieUser, loginUser, provider, false)
                                    :
                                    this.Merge(loginUser, cookieUser, provider, false)
                            );
                        }
                    }
                }
            } else { // new social user
                const txName = social_media_account.user_account_id ? 'new-social-user' : 'new-user';
                return db.tx(txName, innerDb => {
                    return this.CreateSocialUser(innerDb, social_media_account, provider, !social_media_account.user_account_id);
                });
            }
        } catch (error) {
            console.log('failed to query db', error);
        }
    }

    async GetOverlappingSocialMedias(DB, cookieUser: user_account, loginUser: user_account, provider: string): Promise<string[]> {
        const CommonSocialMedias = [];
        for (const i_Provider of this.validProviders) {
            if (i_Provider !== provider) {
                const q =
                    `SELECT COUNT(*)\n` +
                    `  FROM sweepimp.${i_Provider}_account\n` +
                    ` WHERE user_account_id = $<cookie_user_account_id^>;\n` +
                    `SELECT COUNT(*)\n` +
                    `  FROM sweepimp.${i_Provider}_account\n` +
                    ` WHERE user_account_id = $<login_user_account_id^>`;
                await DB.multi(q, { cookie_user_account_id: cookieUser.user_account_id, login_user_account_id: loginUser.user_account_id })
                    .then(values => {
                        if (values[0][0].count > 0 && values[1][0].count > 0) {
                            CommonSocialMedias.push(i_Provider);
                        }
                    });
            }
        }
        return CommonSocialMedias;
    }

    async Merge(source: user_account, target: user_account, Provider: string, isSimple: boolean): Promise<user_account> {
        const db = DbGetter.getDB();
        const mergeType = (isSimple ? 'simple' : 'complicated');
        const TablesToUpdate = (isSimple ? [] : ['user_sweep_display', 'user_sweep', 'user_social_extra', 'payment']);
        for (const i_Provider of this.validProviders) {
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
            `      ,updated         = current_timestamp\n` +
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
        const updates = [];
        for (const element of TablesToUpdate) {
            updates.push(merge.none(q, {
                table_name: element,
                user_account_id_source: source.user_account_id,
                user_account_id_target: target.user_account_id,
            }));
        }
        await Promise.all(updates);

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
        let q = (CreateUserAccount ? InsertUserAccount : SelectUserAccount);
        const UserAccount = await DB.one(q, social_media_account);
        social_media_account.user_account_id = UserAccount.user_account_id;
        switch (Provider){
            case 'facebook': {
                const expires = new Date();
                const extendData = await this.FacebookService.extendAccessToken(social_media_account.authToken);
                expires.setTime(expires.getTime() + extendData.expiration_seconds * 1000);
                social_media_account.authToken = extendData.access_token;
                social_media_account.expiration_date = expires;
                social_media_account.auth_error = extendData.auth_error;
                break;
            }
        }
        q = `INSERT INTO sweepimp.${Provider}_account\n` +
            `    (${Provider}_account_id, user_account_id, first_name, last_name, email, photo_url, auth_token, id_token, expiration_date, auth_error, created, updated)\n` +
            `VALUES\n` +
            `    ($<id>\n` +
            `    ,$<user_account_id^>\n` +
            `    ,$<firstName>\n` +
            `    ,$<lastName>\n` +
            `    ,$<email>\n` +
            `    ,$<photoUrl>\n` +
            `    ,$<authToken>\n` +
            `    ,$<idToken>\n` +
            `    ,$<expiration_date>\n` +
            `    ,$<auth_error>\n` +
            /*
            (Provider === 'google' ?
                    `    ,$<idToken>\n`
                    :
                    `    ,NULL\n`
            ) +
            */
            `    ,current_timestamp\n` +
            `    ,current_timestamp)`;
        DB.none(q, social_media_account);
        return UserAccount;
    }

    async extendUserAccounts(){
        //Get Facebook users to extend
        const db = DbGetter.getDB();
        let q =
            `SELECT facebook_account_id, auth_token, expiration_date\n` +
            `  FROM sweepimp.facebook_account\n` +
            ` WHERE DATE_PART('day', expiration_date - (current_date + current_time)) < 2\n` +
            `    OR expiration_date IS NULL`;
        let FacebookUsersToExtend = await db.manyOrNone(q);
        let objectKeysArray = Object.keys(FacebookUsersToExtend);
        let extentions = [];
        for(const element in objectKeysArray){
            const expires = new Date();
            let extention = await this.FacebookService.extendAccessToken(FacebookUsersToExtend[element].auth_token);
            expires.setTime(expires.getTime() + extention.expiration_seconds * 1000);
            extentions.push({
                facebook_account_id: FacebookUsersToExtend[element].facebook_account_id,
                auth_token: (extention.access_token ? extention.access_token : FacebookUsersToExtend[element].auth_token),
                expires: expires,
                error: extention.auth_error
            });
        };
        console.log(extentions);
        if (extentions.length > 0) {
            q = `UPDATE sweepimp.facebook_account\n` +
                `   SET auth_token      = $<auth_token>\n` +
                `      ,expiration_date = $<expires>\n` +
                `      ,auth_error      = $<error>\n` +
                `      ,updated         = current_timestamp\n` +
                ` WHERE facebook_account_id = $<facebook_account_id>;\n`;
            db.task('Extend-Facebook', innerDB => {
                extentions.forEach(element => {
                    db.none(q, element);
                });
            });
        }
    }
}