import { DbGetter } from '../dal/DbGetter';
import { BaseService } from './base.service';
import { Win, URL, user_sweep, user_sweep_display, payment_package, Search } from '../../../shared/classes';
import { PaymentService } from './payment.service'
import { HttpException, HttpStatus } from '@nestjs/common';

export class UserSweepService extends BaseService<user_sweep> {
    PaymentService: PaymentService;

    constructor() {
        super('user_sweep');
        this.PaymentService = new PaymentService();
    }

    async GetSweeps(user_sweep_search: Search, status: string): Promise<user_sweep_display[]> {
        const db = DbGetter.getDB();
        console.log(user_sweep_search);
        //console.log(new Date(user_sweep_search.last_entry_date.toString()).getTime().toString());
        var lastSweep = ``;
        if (user_sweep_search.lastUserSweep) {
            lastSweep = (user_sweep_search.lastUserSweep.deleted_yn ? 1 : 0).toString()
                    + (user_sweep_search.lastUserSweep.last_entry_date ? new Date(user_sweep_search.lastUserSweep.last_entry_date).getTime().toString() : `0000000000000`)
                    + (user_sweep_search.lastUserSweep.end_date ? (9999999999999 - new Date(user_sweep_search.lastUserSweep.end_date.toString()).getTime()).toString() : `9999999999999`)
                    + (user_sweep_search.lastUserSweep.user_sweep_id ? 1 : 0).toString()
                    ;
        } else {
            lastSweep = `0`;
        }
        console.log(`lastSweep:` + lastSweep);
        const q =
            `SELECT *\n` +
            `  FROM sweepimp.user_sweep_display\n` +
            ` WHERE user_account_id = $<user_account_id^>\n`;
        let where = ``;
        //let filter = ``;
        if (user_sweep_search.nameSearch) {
            where = where + `   AND upper(sweep_name) like '%' || upper($<search>) || '%'\n`;
        }
        let order_by = ``;
        switch (status) {
            case 'live': {
                where = where + `   AND end_date >= now()\n`;
                order_by = `ORDER BY deleted_yn, last_entry_date, end_date desc, user_sweep_id\n`;
                break;
            }
            case 'ended': {
                where = where +
                    `   AND (  end_date BETWEEN now() - interval '1 month' AND now()\n` +
                    `       OR won_yn = true)\n`
                ;
                order_by = `ORDER BY deleted_yn, end_date desc, user_sweep_id\n`;
                break;
            }
            case 'won': {
                where = where +
                    `   AND won_yn = true\n` +
                    `   AND EXTRACT(YEAR FROM end_date) = $<year^>\n` +
                    (user_sweep_search.dateSearch.month ? `   AND EXTRACT(MONTH FROM end_date) = $<month^>\n` : ``)
                ;
                order_by = `ORDER BY end_date, user_sweep_id\n`;
                break;
            }
        }
        order_by = order_by + `;`
        return db.manyOrNone(q + where + order_by, user_sweep_search);
    }

    async GetWins(id: number): Promise<Win[]> {
        const db = DbGetter.getDB();
        const q =
            `SELECT EXTRACT(YEAR FROM end_date) win_year\n` +
            `      ,to_char(end_date, 'TMMonth') win_month\n` +
            `      ,EXTRACT(MONTH FROM end_date) month_numeric\n` +
            `      ,sum(prize_value) prize_value_sum\n` +
            `  FROM sweepimp.user_sweep\n` +
            ` WHERE user_account_id = $<id^>\n` +
            `   AND won_yn = true\n` +
            `GROUP BY EXTRACT(YEAR FROM end_date)\n` +
            `        ,to_char(end_date, 'TMMonth')\n` +
            `        ,EXTRACT(MONTH FROM end_date)\n` +
            `UNION ALL\n` +
            `SELECT EXTRACT(YEAR FROM end_date) win_year\n` +
            `      ,null win_month\n` +
            `      ,null month_numeric\n` +
            `      ,sum(prize_value) prize_value_sum\n` +
            `  FROM sweepimp.user_sweep\n` +
            ` WHERE user_account_id = $<id^>\n` +
            `   AND won_yn = true\n` +
            `GROUP BY EXTRACT(YEAR FROM end_date)\n` +
            `ORDER BY win_year desc, month_numeric desc`;
        return db.manyOrNone(q, { id });
    }

    async GetSweepURL(id: number): Promise<string> {
        const db = DbGetter.getDB();
        const q =
            `SELECT user_sweep_id\n` +
            `      ,coalesce(us.frequency_url, us.sweep_url) sweep_url\n` +
            `  FROM sweepimp.user_sweep\n` +
            ` WHERE user_sweep_id = $<id^>`;
        const result = await db.oneOrNone<Promise<URL>>(q, { id });
        this.ManageEntry([id]);
        return result.sweep_url;
    }

    async GetSweepURLs(id: number): Promise<string[]> {
        const db = DbGetter.getDB();
        const q =
            `SELECT us.user_sweep_id\n` +
            `      ,coalesce(us.frequency_url, us.sweep_url) sweep_url\n` +
            `  FROM sweepimp.user_sweep         us\n` +
            `  JOIN sweepimp.user_sweep_display usd USING (user_sweep_id)\n` +
            ` WHERE us.user_account_id = $<id^>\n` +
            `   AND us.end_date >= now()\n` +
            `   AND (  usd.last_entry_date is null\n` +
            `       OR usd.last_entry_date < current_date - interval '1 DAY' * us.frequency_days)`;
        const sweeps = [];
        const urls = [];
        const result = await db.manyOrNone<URL>(q, { id });
        result.forEach(value => {
            sweeps.push(value.user_sweep_id);
            urls.push(value.sweep_url);
        });
        if (result.length > 0){
            try {
                await this.ManageEntry(sweeps);
            } catch(err) {
                urls.splice(0,urls.length);
                console.log('Error in ManageEntry');
            }
        }
        return urls;
    }

    async ManageEntry(sweep_ids: number[]) {
        const db = DbGetter.getDB();
        let insert =
            'INSERT INTO sweepimp.sweep_entry\n' +
            `    (user_sweep_id\n` +
            `    ,entry_date\n` +
            `    ,created\n` +
            `    ,updated)\n`;
        sweep_ids.forEach(value => {
            insert = insert +
                `SELECT ${value}, current_timestamp, current_timestamp, current_timestamp\n` +
                `UNION ALL\n`;
        });
        // replace last UNION ALL\n with a ;
        insert = insert.replace(new RegExp(`UNION ALL\n$`), ';');
        const update =
            `UPDATE sweepimp.user_sweep_display\n` +
            `   SET total_entries = coalesce(total_entries, 0) + 1\n` +
            `      ,last_entry_date = current_timestamp\n` +
            `      ,updated = current_timestamp\n` +
            ` WHERE user_sweep_id IN ($<user_sweep_ids:csv>)`;
        await db.tx('entry', async DB => {
            await DB.one(insert);
            await DB.one(update, { user_sweep_ids: sweep_ids });
        });
    }

    async ToggleSweepState(column: string, id: number, state: boolean): Promise<user_sweep_display> {
        const db = DbGetter.getDB();
        // build new sweep
        const new_user_sweep = await this.getItem(id, 'user_sweep_id');
        switch (column){
            case 'deleted_yn': {
                new_user_sweep.deleted_yn = state;
                break;
            }
            case 'won_yn': {
                new_user_sweep.won_yn = state;
                break;
            }
        }
        return this.ManageSweep(new_user_sweep);
    }

    async ManageSweep(user_sweep: user_sweep): Promise<user_sweep_display> {
        if (await this.CheckSweepLimit(user_sweep)){
            if (user_sweep.user_sweep_id) { // existing sweep - update
                return this.UpdateSweep(user_sweep);
            } else { // new sweep - insert
                return this.InsertSweep(user_sweep);
            }
        }
    }

    async InsertSweep(user_sweep: user_sweep): Promise<user_sweep_display> {
        const db = DbGetter.getDB();
            return db.tx('new-sweep', innerDb => {
                return this.InsertSweepInner(innerDb, user_sweep);
            });
    }

    async CheckSweepLimit(new_user_sweep: user_sweep): Promise<boolean>{
        const db = DbGetter.getDB();
        const paymentPackage = await this.PaymentService.getCurrentPackage(new_user_sweep.user_account_id);
        const now = new Date();
        var sweepRevive = 0;
        if (!paymentPackage) {
            // user did not pay
            console.log('User does not an active payment plan');
            throw new HttpException('User does not an active payment plan', HttpStatus.FORBIDDEN);
        }
        var q = 
            `SELECT SUM(CASE WHEN DATE_PART('day', now() - created) <= 0 THEN 1 ELSE 0 END) daily_sweeps\n` +
            `      ,SUM(CASE WHEN (DATE_PART('year', now()) - DATE_PART('year', created)) * 12\n` +
            `                   + (DATE_PART('month', now()) - DATE_PART('month', created)) <= 0 THEN 1 ELSE 0 END) monthly_sweeps\n` +
            `  FROM sweepimp.user_sweep\n` +
            ` WHERE user_account_id = $<user_account_id^>\n` +
            `   AND deleted_yn = false\n` +
            `   AND end_date >= now();`;
        const liveSweeps = await db.oneOrNone(q, new_user_sweep);
        // prevent sweep update to live if # of sweeps exceeded max
        if (new_user_sweep.user_sweep_id) { // existing sweep - update
            const existing_user_sweep = await this.getItem(new_user_sweep.user_sweep_id, 'user_sweep_id');
            if ((existing_user_sweep.deleted_yn && !new_user_sweep.deleted_yn) ||
                (existing_user_sweep.end_date < now && new_user_sweep.end_date > now)
                ){
                sweepRevive = 1;
            }
        }
        if (liveSweeps){
            // live sweeps are calculated before the insert, but update is taken into account => add 1 to max sweeps when updating
            if ((Number(liveSweeps.daily_sweeps) + sweepRevive) >= (Number(paymentPackage.max_daily_sweeps) + Number(new_user_sweep.user_sweep_id ? 1 : 0))){
                console.log('User daily sweeps reached plan maxinum (' + paymentPackage.max_daily_sweeps.toString() + ')');
                throw new HttpException('User daily sweeps reached plan maxinum (' + paymentPackage.max_daily_sweeps.toString() + ')', HttpStatus.FORBIDDEN);
            }
            if ((Number(liveSweeps.monthly_sweeps) + sweepRevive) >= paymentPackage.max_monthly_live_sweeps){
                console.log('User monthly live sweeps reached plan maxinum (' + paymentPackage.max_monthly_live_sweeps.toString() + ')');
                throw new HttpException('User monthly live sweeps reached plan maxinum (' + paymentPackage.max_monthly_live_sweeps.toString() + ')', HttpStatus.FORBIDDEN);
            }
        }
        return true;
    }

    async UpdateSweep(user_sweep: user_sweep): Promise<user_sweep_display> {
        const db = DbGetter.getDB();
        const old_user_sweep = await this.getItem(user_sweep.user_sweep_id, 'user_sweep_id');
        return db.tx('update-sweep', innerDb => {
            return this.UpdateSweepInner(innerDb, user_sweep, old_user_sweep);
        });
    }

    async UpdateSweepInner(DB, user_sweep: user_sweep, old_user_sweep: user_sweep): Promise<user_sweep_display> {
        const ChangedColumns = this.GetChangedColumns(user_sweep, old_user_sweep);
        //case each line
        const q = this.BuildUpdateString(ChangedColumns);
        const UserSweepDisplay = await DB.multi(q, user_sweep);
        return UserSweepDisplay[1][0];
    }

    async InsertSweepInner(DB, user_sweep: user_sweep): Promise<user_sweep_display> {
        let q =
            `INSERT INTO sweepimp.user_sweep\n` +
            `    (user_account_id\n` +
            `    ,sweep_name\n` +
            `    ,sweep_url\n` +
            `    ,end_date\n` +
            `    ,is_frequency\n` +
            `    ,frequency_url\n` +
            `    ,frequency_days\n` +
            `    ,is_referral\n` +
            `    ,referral_url\n` +
            `    ,referral_frequency\n` +
            `    ,personal_refer_message\n` +
            `    ,refer_facebook\n` +
            `    ,refer_twitter\n` +
            `    ,refer_google\n` +
            `    ,refer_linkedin\n` +
            `    ,refer_pinterest\n` +
            `    ,thanks_to\n` +
            `    ,thanks_social_media_id\n` +
            `    ,won_yn\n` +
            `    ,prize_value\n` +
            `    ,deleted_yn\n` +
            `    ,created\n` +
            `    ,updated)\n` +
            `VALUES \n` +
            `    ($<user_account_id>\n` +
            `    ,$<sweep_name>\n` +
            `    ,$<sweep_url>\n` +
            `    ,$<end_date>\n` +
            `    ,$<is_frequency>\n` +
            `    ,$<frequency_url>\n` +
            `    ,$<frequency_days>\n` +
            `    ,$<is_referral>\n` +
            `    ,$<referral_url>\n` +
            `    ,$<referral_frequency>\n` +
            `    ,$<personal_refer_message>\n` +
            `    ,$<refer_facebook>\n` +
            `    ,$<refer_twitter>\n` +
            `    ,$<refer_google>\n` +
            `    ,$<refer_linkedin>\n` +
            `    ,$<refer_pinterest>\n` +
            `    ,$<thanks_to>\n` +
            `    ,$<thanks_social_media_id>\n` +
            `    ,false\n` +
            `    ,$<prize_value>\n` +
            `    ,false\n` +
            `    ,current_timestamp\n` +
            `    ,current_timestamp\n` +
            `    )\n` +
            `    RETURNING *`;
        const UserSweep = await DB.one(q, user_sweep);
        q = `INSERT INTO sweepimp.user_sweep_display\n` +
            `    (user_sweep_id\n` +
            `    ,user_account_id\n` +
            `    ,sweep_name\n` +
            `    ,sweep_url\n` +
            `    ,end_date\n` +
            `    ,is_frequency\n` +
            `    ,frequency_url\n` +
            `    ,last_entry_date\n` +
            `    ,total_entries\n` +
            `    ,is_referral\n` +
            `    ,referral_url\n` +
            `    ,total_shares\n` +
            `    ,thanks_to\n` +
            `    ,thanks_social_media_id\n` +
            `    ,won_yn\n` +
            `    ,deleted_yn\n` +
            `    ,created\n` +
            `    ,updated)\n` +
            `VALUES \n` +
            `    ($<user_sweep_id>\n` +
            `    ,$<user_account_id>\n` +
            `    ,$<sweep_name>\n` +
            `    ,$<sweep_url>\n` +
            `    ,$<end_date>\n` +
            `    ,$<is_frequency>\n` +
            `    ,$<frequency_url>\n` +
            `    ,null\n` +
            `    ,null\n` +
            `    ,$<is_referral>\n` +
            `    ,$<referral_url>\n` +
            `    ,null\n` +
            `    ,$<thanks_to>\n` +
            `    ,$<thanks_social_media_id>\n` +
            `    ,false\n` +
            `    ,false\n` +
            `    ,current_timestamp\n` +
            `    ,current_timestamp\n` +
            `    )\n` +
            `RETURNING *`;
        return DB.one(q, UserSweep);
    }

    GetChangedColumns(new_user_sweep: user_sweep, old_user_sweep: user_sweep): any{
        const retObj = {
            sweep_name: false,
            sweep_url: false,
            end_date: false,
            is_frequency: false,
            frequency_url: false,
            frequency_days: false,
            is_referral: false,
            referral_url: false,
            referral_frequency: false,
            personal_refer_message: false,
            refer_facebook: false,
            refer_twitter: false,
            refer_google: false,
            refer_linkedin: false,
            refer_pinterest: false,
            thanks_to: false,
            thanks_social_media_id: false,
            won_yn: false,
            prize_value: false,
            deleted_yn: false,
        };

        Object.keys(retObj).forEach(key => {
            if (new_user_sweep[key] instanceof Date) {
                retObj[key] = new_user_sweep[key].getTime() !== old_user_sweep[key].getTime();
            } else {
                retObj[key] = new_user_sweep[key] !== old_user_sweep[key];
            }
        });
        return retObj;
    }

    BuildUpdateString(ChangedColumns): string{
        var q = ``;
        var UserSweepColumns = `updated                = current_timestamp\n`;
        var UserSweepDisplayColumns = `updated                = current_timestamp\n`;
        if (ChangedColumns.sweep_name){
            UserSweepColumns = UserSweepColumns + `      ,sweep_name             = $<sweep_name>\n`;
            UserSweepDisplayColumns = UserSweepDisplayColumns + `      ,sweep_name             = $<sweep_name>\n`;
        }
        if (ChangedColumns.end_date){
            UserSweepColumns = UserSweepColumns + `      ,end_date               = $<end_date>\n`;
            UserSweepDisplayColumns = UserSweepDisplayColumns + `      ,end_date               = $<end_date>\n`;
        }
        if (ChangedColumns.is_frequency){
            UserSweepColumns = UserSweepColumns + `      ,is_frequency           = $<is_frequency>\n`;
            UserSweepDisplayColumns = UserSweepDisplayColumns + `      ,is_frequency           = $<is_frequency>\n`;
        }
        if (ChangedColumns.frequency_url){
            UserSweepColumns = UserSweepColumns + `      ,frequency_url          = $<frequency_url>\n`;
            UserSweepDisplayColumns = UserSweepDisplayColumns + `      ,frequency_url          = $<frequency_url>\n`;
        }
        if (ChangedColumns.frequency_days){UserSweepColumns = UserSweepColumns + `      ,frequency_days         = $<frequency_days>\n`;}
        if (ChangedColumns.is_referral){
            UserSweepColumns = UserSweepColumns + `      ,is_referral            = $<is_referral>\n`;
            UserSweepDisplayColumns = UserSweepDisplayColumns + `      ,is_referral            = $<is_referral>\n`;
        }
        if (ChangedColumns.referral_url){
            UserSweepColumns = UserSweepColumns + `      ,referral_url           = $<referral_url>\n`;
            UserSweepDisplayColumns = UserSweepDisplayColumns + `      ,referral_url           = $<referral_url>\n`;
        }
        if (ChangedColumns.referral_frequency){UserSweepColumns = UserSweepColumns + `      ,referral_frequency     = $<referral_frequency>\n`;}
        if (ChangedColumns.personal_refer_message){UserSweepColumns = UserSweepColumns + `      ,personal_refer_message = $<personal_refer_message>\n`;}
        if (ChangedColumns.refer_facebook){UserSweepColumns = UserSweepColumns + `      ,refer_facebook         = $<refer_facebook>\n`;}
        if (ChangedColumns.refer_twitter){UserSweepColumns = UserSweepColumns + `      ,refer_twitter          = $<refer_twitter>\n`;}
        if (ChangedColumns.refer_google){UserSweepColumns = UserSweepColumns + `      ,refer_google           = $<refer_google>\n`;}
        if (ChangedColumns.refer_linkedin){UserSweepColumns = UserSweepColumns + `      ,refer_linkedin         = $<refer_linkedin>\n`;}
        if (ChangedColumns.refer_pinterest){UserSweepColumns = UserSweepColumns + `      ,refer_pinterest        = $<refer_pinterest>\n`;}
        if (ChangedColumns.refer_pinterest){UserSweepColumns = UserSweepColumns + `      ,refer_pinterest        = $<refer_pinterest>\n`;}
        if (ChangedColumns.thanks_to){
            UserSweepColumns = UserSweepColumns + `      ,thanks_to              = $<thanks_to>\n`;
            UserSweepDisplayColumns = UserSweepDisplayColumns + `      ,thanks_to              = $<thanks_to>\n`;
        }
        if (ChangedColumns.thanks_social_media_id){
            UserSweepColumns = UserSweepColumns + `      ,thanks_social_media_id = $<thanks_social_media_id>\n`;
            UserSweepDisplayColumns = UserSweepDisplayColumns + `      ,thanks_social_media_id = $<thanks_social_media_id>\n`;
        }
        if (ChangedColumns.won_yn){
            UserSweepColumns = UserSweepColumns + `      ,won_yn                 = $<won_yn>\n`;
            UserSweepDisplayColumns = UserSweepDisplayColumns + `      ,won_yn                 = $<won_yn>\n`;
        }
        if (ChangedColumns.prize_value){UserSweepColumns = UserSweepColumns + `      ,prize_value            = $<prize_value>\n`;}
        if (ChangedColumns.deleted_yn){
            UserSweepColumns = UserSweepColumns + `      ,deleted_yn             = $<deleted_yn>\n`;
            UserSweepDisplayColumns = UserSweepDisplayColumns + `      ,deleted_yn             = $<deleted_yn>\n`;
        }
        return (
        `UPDATE sweepimp.user_sweep\n` +
        `   SET ` + UserSweepColumns +
        ` WHERE user_sweep_id = $<user_sweep_id^>;\n` +
        `UPDATE sweepimp.user_sweep_display\n` +
        `   SET ` + UserSweepDisplayColumns +
        ` WHERE user_sweep_id = $<user_sweep_id^>\n` +
        `RETURNING *`);
    };
}