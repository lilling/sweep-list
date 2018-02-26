import { DbGetter } from './DbGetter';
import { BaseService } from './base.service';
import { user_account, facebook_account, google_account } from './DB';
import { SocialUser } from 'angularx-social-login';

export class UserAccountService extends BaseService<user_account> {
    constructor() {
        super('user_account');
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

/*    async FacebookLogin(facebook_account: SocialUser): Promise<user_account> {
        const db = DbGetter.getDB();
        var q = `SELECT user_account.*\n` +
                `  FROM sweepimp.facebook_account\n` +
                `  JOIN sweepimp.user_account using (user_account_id)\n` +
                ` WHERE facebook_account_id = $<id>`;
        try {
            const data = await db.any<user_account>(q, facebook_account);
            return data[0];
        } catch (error) {
            console.log('failed to query db', error);
        }
        q = `INSERT INTO sweepimp.facebook_account\n` +
            `    (facebook_account_id, user_account_id, first_name, last_name, email, photo_url, created, updated)\n` +
            `VALUES\n` +
            `    ($<id>\n` +
//            `    ,${user_account_id}\n` +
            `    ,$<firstName>\n` +
            `    ,$<lastName>\n` +
            `    ,$<email>\n` +
            `    ,$<photoUrl>\n` +
            `    ,current_timestamp\n` +
            `    ,current_timestamp)`;
        try {
            const data = await db.any<user_account>(q, facebook_account);
            return data[0];
        } catch (error) {
            console.log('failed to query db', error);
        }
    }*/
}