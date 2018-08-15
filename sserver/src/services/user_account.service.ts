import { DbGetter } from '../dal/DbGetter';
import { BaseService } from './base.service';
import { user_account, SocialUserAndAccount, facebook_account } from '../../../shared/classes';
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

    async CookieLogin(user_account_id: AAGUID, checkSocialMedias?:boolean): Promise<user_account> {
        const db = DbGetter.getDB();
        return db.task(`cookie-login`, innerDb => {
            return this.CookieLoginInner(innerDb, user_account_id, checkSocialMedias);
        });
    }

    async CookieLoginInner(DB, user_account_id: AAGUID, checkSocialMedias?:boolean): Promise<user_account> {
        const q =
            `SELECT user_account.*\n` +
            `  FROM sweepimp.user_account\n` +
            ` WHERE user_account_id = $<user_account_id>\n` +
            `   AND is_deleted = false;\n` +
            `SELECT retired_user_account.*\n` +
            `  FROM sweepimp.retired_user_account\n` +
            ` WHERE user_account_id = $<user_account_id>\n` +
            `   AND is_deleted = false`;
        let UserAccounts = await DB.multi(q, { user_account_id });
        while (!UserAccounts[0][0] && UserAccounts[1][0].replacement_user_account_id) {
            UserAccounts = await DB.multi(q, { user_account_id: UserAccounts[1][0].replacement_user_account_id });
        }
        const ret = UserAccounts[0][0];
        return ret;
    }

    async SocialMediaLogin(social_media_account_param: SocialUserAndAccount): Promise<user_account> {
        const db = DbGetter.getDB();
        const provider = social_media_account_param.provider.toLowerCase();
        let ret;
        let q =
            `SELECT user_account.*\n` +
            `  FROM sweepimp.${provider}_account\n` +
            `  JOIN sweepimp.user_account using (user_account_id)\n` +
            ` WHERE ${provider}_account_id = $<id>\n` +
            `   AND is_deleted = false`;
        const loginUser = await db.oneOrNone<user_account>(q, social_media_account_param);
        if (loginUser === null) { // new social user
            const txName = social_media_account_param.user_account_id ? `new-social-user` : `new-user`;
            const newUser = await db.tx(txName, innerDb => {
                return this.CreateSocialUser(innerDb, social_media_account_param, provider, !social_media_account_param.user_account_id);
            });
            ret = newUser;
        } else { // social media user exists
            ret = loginUser;
        }
        return ret;
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
            ` WHERE user_account_id = $<user_account_id>\n` +
            `   AND is_deleted = false`;
        let q = (CreateUserAccount ? InsertUserAccount : SelectUserAccount);
        // Split name into firstName and lastName
        if (social_media_account.name) {
            social_media_account.firstName = social_media_account.name.substr(0, social_media_account.name.indexOf(` `));
            social_media_account.lastName = social_media_account.name.substr(social_media_account.name.indexOf(` `));
        }
        const UserAccount = await DB.one(q, social_media_account);
        social_media_account.user_account_id = UserAccount.user_account_id;
        q = `INSERT INTO sweepimp.${Provider}_account\n` +
            `    (${Provider}_account_id, user_account_id, first_name, last_name, email, photo_url, auth_token, id_token, expiration_date, auth_error, created, updated)\n` +
            `VALUES\n` +
            `    ($<id>\n` +
            `    ,$<user_account_id>\n` +
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
        if (CreateUserAccount) {
            this.PaymentService.makePayment(social_media_account.user_account_id, 1, 0, false);
        }
        return UserAccount;
    }

    async deleteUserAccountConfirm(user_account_id: AAGUID) {
        const db = DbGetter.getDB();
        const q =
            `SELECT COALESCE(SUM(CASE WHEN is_frequency = true THEN 1 ELSE 0 END), 0) tasks\n` +
            `      ,COALESCE(SUM(CASE WHEN end_date >= now() THEN 1 ELSE 0 END), 0) active\n` +
            `      ,COALESCE(SUM(CASE WHEN end_date < now() THEN 1 ELSE 0 END), 0) ended\n` +
            `      ,COALESCE(SUM(CASE WHEN won_yn = true THEN 1 ELSE 0 END), 0) won\n` +
            `  FROM sweepimp.user_sweep\n` +
            ` WHERE user_account_id = $<user_account_id>\n`;
        let PreDeleteData = await db.one(q, { user_account_id });
        return PreDeleteData;
    }

    async deleteUserAccount(user_account_id: AAGUID): Promise<boolean> {
        const db = DbGetter.getDB();
        var flag = false;
        let q = ``;
        await db.tx(`delete-user-account`, del => {
            q = `UPDATE sweepimp.user_account\n` +
                `   SET is_deleted = true\n` +
                `      ,first_name = null\n` +
                `      ,last_name  = null\n` +
                `      ,updated    = current_timestamp\n` +
                ` WHERE user_account_id = $<user_account_id>\n`;
            db.none(q, { user_account_id });
            this.validProviders.forEach(i_Provider => {
                q = `DELETE FROM sweepimp.${i_Provider}_account\n` +
                    ` WHERE user_account_id = $<user_account_id>`;
                    db.none(q, {user_account_id});
            })
            flag = true;
        });
        return flag;
    }
}