import { DbGetter } from '../dal/DbGetter';
import { BaseService } from './base.service';
import { user_account, ExtandedSocialUser, facebook_account } from '../../../shared/classes';
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

    async CookieLogin(user_account_id: AAGUID): Promise<user_account> {
        const db = DbGetter.getDB();
        const q =
            `SELECT user_account.*\n` +
            `  FROM sweepimp.user_account\n` +
            ` WHERE user_account_id = $<user_account_id>\n` +
            `   AND is_deleted = false`;
        const UserAccount = await db.oneOrNone<user_account>(q, {user_account_id: user_account_id });
        const ret = UserAccount;
        return ret;
    }

    async Login(account_param: ExtandedSocialUser): Promise<user_account> {
        const db = DbGetter.getDB();
        let ret;
        let q =
            `SELECT user_account_id, first_name, last_name, email, photo_url\n` +
            `  FROM sweepimp.user_account\n` +
            ` WHERE is_deleted = false\n` +
            `   AND email = $<email>\n` +
            (account_param.photoUrl ? '' :
            `   AND hashed_password = crypt($<password>, hashed_password)`);
        const loginUser = await db.oneOrNone<user_account>(q, account_param);
        if (loginUser === null && account_param.photoUrl) { // new social user
            const newUser = await this.CreateUser(db, account_param);;
            ret = newUser;
        } else if (loginUser === null){ // email not exist or wrong password
            ret = null;
        } else { // correct login
            ret = loginUser;
        }
        return ret;
    }

    async CreateUser(DB, account: ExtandedSocialUser): Promise<user_account> {
        const q =
            `INSERT INTO sweepimp.user_account\n` +
            `    (first_name, last_name, is_deleted, email, hashed_password, photo_url, created, updated)\n` +
            `VALUES\n` +
            `    ($<firstName>\n` +
            `    ,$<lastName>\n` +
            `    ,false\n` +
            `    ,$<email>\n` +
            (account.photoUrl ? `` :
            `    ,crypt($<password>, gen_salt('bf', 8))\n`) +
            `    ,$<photo_url>\n` +
            `    ,current_timestamp\n` +
            `    ,current_timestamp)\n` +
            `RETURNING *`;
        // Split name into firstName and lastName
        if (account.name) {
            account.firstName = account.name.substr(0, account.name.indexOf(` `));
            account.lastName = account.name.substr(account.name.indexOf(` `));
        }
        const UserAccount = await DB.one(q, account);
        // create free payment plan for new user
        this.PaymentService.makePayment(UserAccount.user_account_id, 1, 0, false);
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
                `   SET is_deleted      = true\n` +
                `      ,first_name      = null\n` +
                `      ,last_name       = null\n` +
                `      ,email           = null\n` +
                `      ,hashed_password = null\n` +
                `      ,photo_url       = null\n` +
                `      ,updated         = current_timestamp\n` +
                ` WHERE user_account_id = $<user_account_id>\n`;
            db.none(q, { user_account_id });
            flag = true;
        });
        return flag;
    }
}