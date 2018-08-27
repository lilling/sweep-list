import { DbGetter } from '../dal/DbGetter';
import { BaseService } from './base.service';
import { user_account, ExtandedSocialUser } from '../../../shared/classes';
import { FacebookService } from './facebook.service';
import { PaymentService } from './payment.service';
import { ForbiddenException } from '@nestjs/common';

export class UserAccountService extends BaseService<user_account> {
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
        const UserAccount = await db.oneOrNone<user_account>(q, { user_account_id });
        return UserAccount;
    }

    async Login(account_param: ExtandedSocialUser): Promise<{ user: user_account, isNew?: boolean }> {
        const db = DbGetter.getDB();
        const q =
            `SELECT user_account_id, first_name, last_name, email, photo_url\n` +
            `  FROM sweepimp.user_account\n` +
            ` WHERE is_deleted = false\n` +
            `   AND email = $<email>\n` +
            (account_param.isSocial ? '' :
            `   AND hashed_password = crypt($<password>, hashed_password)`);
        const loginUser = await db.oneOrNone<user_account>(q, account_param);
        if (loginUser === null && account_param.isSocial) { // new social user
            const user = await this.CreateUserInner(db, account_param);
            return { user, isNew: true };
        } else if (loginUser === null){ // email not exist or wrong password
            throw new ForbiddenException('Email does not exist or wrong password');
        }
        return { user: loginUser };
    }

    async checkEmailAvailability(email: string): Promise<boolean>{
        const db = DbGetter.getDB();
        const q =
            `SELECT SUM(1) email_exists\n` +
            `  FROM sweepimp.user_account\n` +
            ` WHERE is_deleted = false\n` +
            `   AND email = $<email>\n`;
        const emailExists = await db.oneOrNone(q, { email });
        return !emailExists.email_exists;
    }

    async CreateUser(account_param: ExtandedSocialUser): Promise<{ user: user_account, isNew?: boolean }> {
        const db = DbGetter.getDB();
        if (await this.checkEmailAvailability(account_param.email)) {
            const user = await this.CreateUserInner(db, account_param);
            return { user, isNew: true };
        }

        throw new ForbiddenException('email already in use');
    }

    async CreateUserInner(DB, account: ExtandedSocialUser): Promise<user_account> {
        const q =
            `INSERT INTO sweepimp.user_account\n` +
            `    (first_name, last_name, is_deleted, email, hashed_password, photo_url, created, updated)\n` +
            `VALUES\n` +
            `    ($<firstName>\n` +
            `    ,$<lastName>\n` +
            `    ,false\n` +
            `    ,$<email>\n` +
            (account.isSocial ?
            `    ,null\n` :
            `    ,crypt($<password>, gen_salt('bf', 8))\n`) +
            (account.isSocial ?
            `    ,$<photoUrl>\n` :
            `    ,null\n` ) +
            `    ,current_timestamp\n` +
            `    ,current_timestamp)\n` +
            `RETURNING *`;
        // Split name into firstName and lastName
        if (account.name) {
            const indexOfSpace = account.name.indexOf(` `);
            if (indexOfSpace > 0) {
                account.firstName = account.name.substr(0, indexOfSpace);
                account.lastName = account.name.substr(indexOfSpace + 1);
            } else {
                account.firstName = account.name;
                account.lastName = ``;
            }
        }
        const UserAccount = await DB.one(q, account);
        // create free payment plan for new user
        this.PaymentService.makePayment(UserAccount.user_account_id, 1, 0, false);
        return UserAccount;
    }

    async UpdateUser(SMs: user_account): Promise<user_account> {
        const db = DbGetter.getDB();
        const q =
            `UPDATE sweepimp.user_account\n` +
            `   SET has_facebook  = $<has_facebook>\n` +
            `      ,has_twitter   = $<has_twitter>\n` +
            `      ,has_google    = $<has_google>\n` +
            `      ,has_linkedin  = $<has_linkedin>\n` +
            `      ,has_pinterest = $<has_pinterest>\n` +
            ` WHERE user_account_id = $<user_account_id>\n` +
            `RETURNING *`;
        const UserAccount = await db.one(q, SMs);
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
        const PreDeleteData = await db.one(q, { user_account_id });
        return PreDeleteData;
    }

    async deleteUserAccount(user_account_id: AAGUID): Promise<boolean> {
        const db = DbGetter.getDB();
        let flag = false;
        await db.tx(`delete-user-account`, del => {
            const q = `UPDATE sweepimp.user_account\n` +
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