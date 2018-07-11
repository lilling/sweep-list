import { DbGetter } from '../dal/DbGetter';
import { BaseService } from './base.service';
import { user_account, SocialUserAndAccount, facebook_account } from '../../../shared/classes';
import { FacebookExtention } from '../../classes';
import { FacebookService } from './facebook.service'
import { SocialMedia } from '../../../shared/models/social-media.enum'
import { PaymentService } from './payment.service'

export class UserAccountService extends BaseService<user_account> {
    validProviders = [`facebook`];
    FacebookService: FacebookService;
    PaymentService: PaymentService;

    constructor() {
        super(`user_account`);
        this.FacebookService = new FacebookService();
        this.PaymentService = new PaymentService();
    }

    async CookieLogin(id: number): Promise<user_account> {
        const db = DbGetter.getDB();
        return db.task(`cookie-login`, innerDb => {
            return this.CookieLoginInner(innerDb, id);
        });
    }

    async CookieLoginInner(DB, id: number): Promise<user_account> {
        const q =
            `SELECT user_account.*\n` +
            `  FROM sweepimp.user_account\n` +
            ` WHERE user_account_id = $<user_account_id^>\n` +
            `   AND is_deleted = false;\n` +
            `SELECT retired_user_account.*\n` +
            `  FROM sweepimp.retired_user_account\n` +
            ` WHERE user_account_id = $<user_account_id^>\n` +
            `   AND is_deleted = false`;
        let UserAccounts = await DB.multi(q, { user_account_id: id });
        while (!UserAccounts[0][0] && UserAccounts[1][0].replacement_user_account_id) {
            UserAccounts = await DB.multi(q, { user_account_id: UserAccounts[1][0].replacement_user_account_id });
        }
        const ret = UserAccounts[0][0];
        ret.unlinkedSocialMedias = await this.GetSocialMedia(ret.user_account_id, true);
        ret.allSocialMedias = await this.GetSocialMedia(ret.user_account_id);
        return ret;
    }

    async GetSocialMedia(user_account_id: number, getExpired?: boolean): Promise<any> {
        if (getExpired){
            return await this.getExpiredSocialMedia(user_account_id);
        } else {
            return await this.getAllSocialMedia(user_account_id);
        }
    }

    async getExpiredSocialMedia(user_account_id: number): Promise<any>{
        const SocialMedias = [];
        for (const i_Provider of this.validProviders) {
            const status = await this.checkSocialMedia(i_Provider, user_account_id);
            if (status !== null){
                SocialMedias.push({SocialMedia: SocialMedia[i_Provider], status: status});
            }
        }
        return SocialMedias;
    }

    async checkSocialMedia(i_Provider: string, user_account_id: number): Promise<string>{
        const db = DbGetter.getDB();
        let ret = ``;
        let q = ``;
        switch (i_Provider){
            case `facebook`: {
                q = `SELECT facebook_account_id, auth_token, auth_error, expiration_date\n` +
                    `  FROM sweepimp.facebook_account\n` +
                    ` WHERE user_account_id = $<user_account_id^>`;
                const facebookAccount = await db.oneOrNone<facebook_account>(q, {user_account_id});
                if (facebookAccount){
                    const extention = await this.FacebookService.extendAccessToken(facebookAccount.auth_token);
console.log(`extention`);
console.log(extention);
                    const publishGranted = await this.FacebookService.checkGrantedPublish(facebookAccount.facebook_account_id, facebookAccount.auth_token);
console.log(`publishGranted`);
console.log(publishGranted);
                    facebookAccount.auth_token = extention.access_token;
                    facebookAccount.auth_error = extention.auth_error;
                    facebookAccount.expiration_date = extention.expiration_date;
                    q = `UPDATE sweepimp.facebook_account\n` +
                        `   SET auth_token      = $<auth_token>\n` +
                        `      ,expiration_date = $<expiration_date>\n` +
                        `      ,auth_error      = $<auth_error>\n` +
                        `      ,updated         = current_timestamp\n` +
                        ` WHERE facebook_account_id = $<facebook_account_id>;\n`;
                    db.none(q, facebookAccount);
                    ret = (facebookAccount.auth_error ? 'authentication error' : !publishGranted ? 'Publish not granted' : null);
                }
                break;
            }
        }
console.log(`ret`);
console.log(ret);
        return ret;
    }

    async getAllSocialMedia(user_account_id: number): Promise<string[]>{
        const db = DbGetter.getDB();
        const SocialMedias = [];
        for (const i_Provider of this.validProviders) {
            let q = `SELECT COUNT(*)\n` +
                    `  FROM sweepimp.${i_Provider}_account\n` +
                    ` WHERE user_account_id = $<user_account_id^>`;
            await db.oneOrNone(q, { user_account_id })
                .then(values => {
                    if (values.count > 0) {
                        SocialMedias.push(SocialMedia[i_Provider]);
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
            ` WHERE ${provider}_account_id = $<id>\n` +
            `   AND is_deleted = false`;
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
                    loginUser.unlinkedSocialMedias = await this.GetSocialMedia(loginUser.user_account_id, true);
                    loginUser.allSocialMedias = await this.GetSocialMedia(loginUser.user_account_id);
                    return loginUser;
                } else {
                    // Cookie exists, but social media user does not match cookie. SHIT! Merge user accounts?
                    // first, let`s get the cookie user. notice the filter is on user_account_id, not on id (social media`s user id) as before
                    const cookieUser = await this.CookieLogin(social_media_account.user_account_id);
                    const two_minutes = 2 * 60 * 1000;
                    if (now.getTime() - cookieUser.created.getTime() <= two_minutes) {
                        // Cookie user was created recently, probably due to login screen press order. Do a simple merge
                        const mergeUser = await this.Merge(cookieUser, loginUser, provider, true);
                        mergeUser.unlinkedSocialMedias = await this.GetSocialMedia(mergeUser.user_account_id, true);
                        mergeUser.allSocialMedias = await this.GetSocialMedia(mergeUser.user_account_id);
                        return mergeUser;
                    } else {
                        // Two users were active for some time. Complicated merge?
                        const CommonSocialMedias = await this.GetOverlappingSocialMedias(db, cookieUser, loginUser, provider);
                        if (CommonSocialMedias.length) {
                            throw new Error(`This ${provider} user is already connected to another ${CommonSocialMedias} profile`);
                        } else {
                            const isCookieNewer = cookieUser.created > loginUser.created;
                            const [userSource, userTarget] = isCookieNewer ? [cookieUser, loginUser] : [loginUser, cookieUser];
                            const mergeUser = await this.Merge(userSource, userTarget, provider, false);
                            mergeUser.unlinkedSocialMedias = await this.GetSocialMedia(mergeUser.user_account_id, true);
                            mergeUser.allSocialMedias = await this.GetSocialMedia(mergeUser.user_account_id);
                            return mergeUser;
                        }
                    }
                }
            } else { // new social user
                const txName = social_media_account.user_account_id ? `new-social-user` : `new-user`;
                const newUser = await db.tx(txName, innerDb => {
                    return this.CreateSocialUser(innerDb, social_media_account, provider, !social_media_account.user_account_id);
                });
                newUser.unlinkedSocialMedias = await this.GetSocialMedia(newUser.user_account_id, true);
                newUser.allSocialMedias = await this.GetSocialMedia(newUser.user_account_id);
                return newUser;
            }
        } catch (error) {
            console.log(`failed to query db`, error);
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
        const mergeType = (isSimple ? `simple` : `complicated`);
        const TablesToUpdate = (isSimple ? [] : [`user_sweep`, `user_social_extra`, `payment`]);
        for (const i_Provider of this.validProviders) {
            TablesToUpdate.push(i_Provider + `_account`);
        }
        await db.tx(mergeType + `-merge`, merge => {
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
            `    (first_name, last_name, is_deleted, created, updated)\n` +
            `VALUES\n` +
            `    ($<firstName>\n` +
            `    ,$<lastName>\n` +
            `    ,false\n` +
            `    ,current_timestamp\n` +
            `    ,current_timestamp)\n` +
            `RETURNING *`;
        const SelectUserAccount =
            `SELECT user_account.*\n` +
            `  FROM sweepimp.user_account\n` +
            ` WHERE user_account_id = $<user_account_id^>\n` +
            `   AND is_deleted = false`;
        let q = (CreateUserAccount ? InsertUserAccount : SelectUserAccount);
        // Split name into firstName and lastName
        if (social_media_account.name) {
            social_media_account.firstName = social_media_account.name.substr(0, social_media_account.name.indexOf(` `));
            social_media_account.lastName = social_media_account.name.substr(social_media_account.name.indexOf(` `));
        }
        const UserAccount = await DB.one(q, social_media_account);
        social_media_account.user_account_id = UserAccount.user_account_id;
        switch (Provider){
            case `facebook`: {
                const extendData = await this.FacebookService.extendAccessToken(social_media_account.authToken);
                social_media_account.authToken = extendData.access_token;
                social_media_account.expiration_date = extendData.expiration_date;
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
            `    ,current_timestamp\n` +
            `    ,current_timestamp)`;
        DB.none(q, social_media_account);
        // create free payment plan for new user
        if (CreateUserAccount){
            this.PaymentService.makePayment(social_media_account.user_account_id, 1, 0, false);
        }
        return UserAccount;
    }

    async extendFacebookUserAccounts(){
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
            let extention = await this.FacebookService.extendAccessToken(FacebookUsersToExtend[element].auth_token);
            extentions.push({
                facebook_account_id: FacebookUsersToExtend[element].facebook_account_id,
                auth_token: (extention.access_token ? extention.access_token : FacebookUsersToExtend[element].auth_token),
                expiration_date: extention.expiration_date,
                auth_error: extention.auth_error
            });
        };
        if (extentions.length > 0) {
            q = `UPDATE sweepimp.facebook_account\n` +
                `   SET auth_token      = $<auth_token>\n` +
                `      ,expiration_date = $<expiration_date>\n` +
                `      ,auth_error      = $<auth_error>\n` +
                `      ,updated         = current_timestamp\n` +
                ` WHERE facebook_account_id = $<facebook_account_id>;\n`;
            db.task(`Extend-Facebook`, innerDB => {
                extentions.forEach(element => {
                    db.none(q, element);
                });
            });
        }
    }

    async deleteUserAccountConfirm(user_account_id: number){
        const db = DbGetter.getDB();
        const q =
            `SELECT COALESCE(SUM(CASE WHEN is_frequency = true THEN 1 ELSE 0 END), 0) tasks\n` +
            `      ,COALESCE(SUM(CASE WHEN end_date >= now() THEN 1 ELSE 0 END), 0) active\n` +
            `      ,COALESCE(SUM(CASE WHEN end_date < now() THEN 1 ELSE 0 END), 0) ended\n` +
            `      ,COALESCE(SUM(CASE WHEN won_yn = true THEN 1 ELSE 0 END), 0) won\n` +
            `  FROM sweepimp.user_sweep\n` +
            ` WHERE user_account_id = $<user_account_id^>\n`;
        let PreDeleteData = await db.one(q, {user_account_id});
        return PreDeleteData;
    }

    async deleteUserAccount(user_account_id: number): Promise<boolean>{
        const db = DbGetter.getDB();
        var flag = false;
        let q = ``;
        await db.tx(`delete-user-account`, del => {
            q = `UPDATE sweepimp.user_account\n` +
                `   SET is_deleted = true\n` +
                `      ,first_name = null\n` +
                `      ,last_name  = null\n` +
                `      ,updated    = current_timestamp\n` +
                ` WHERE user_account_id = $<user_account_id^>\n`;
            db.none(q, {user_account_id});
            this.validProviders.forEach(i_Provider => {
                q = `DELETE FROM sweepimp.${i_Provider}_account\n` +
                    ` WHERE user_account_id = $<user_account_id^>`;
                    db.none(q, {user_account_id});
            })
            flag = true;
        });
        return flag;
    }
}