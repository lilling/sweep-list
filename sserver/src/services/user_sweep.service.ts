import { DbGetter } from '../dal/DbGetter';
import { BaseService } from './base.service';
import { Win, URL, user_sweep, payment_package, Search } from '../../../shared/classes';
import { PaymentService } from './payment.service'
import { HttpException, HttpStatus } from '@nestjs/common';

export class UserSweepService extends BaseService<user_sweep> {
    PaymentService: PaymentService;

    constructor() {
        super(`user_sweep`);
        this.PaymentService = new PaymentService();
    }

    async GetSweeps(user_sweep_search: Search, status: string): Promise<user_sweep[]> {
        const db = DbGetter.getDB();
        var lastSweep = ``;
        const q =
            `SELECT *\n` +
            `  FROM sweepimp.user_sweep\n` +
            ` WHERE user_account_id = $<user_account_id^>\n`;
        let where = ``;
        if (user_sweep_search.nameSearch) {
            where = where + `   AND upper(sweep_name) like '%' || upper($<nameSearch>) || '%'\n`;
        }
        let order_by = ``;
        switch (status) {
            case `today`:
            case `tomorrow`:
            case `later`: {
                where = this.BuildTodoSweepsWhere(user_sweep_search, status);
                order_by = `ORDER BY frequency_days*24*60*60 - ((EXTRACT(EPOCH FROM current_timestamp) - EXTRACT(EPOCH FROM last_entry_date))) nulls first, end_date, user_sweep_id\n`;
                break;
            }
            case `active`: {
                where = this.BuildActiveSweepsWhere(user_sweep_search);
                order_by = `ORDER BY deleted_yn, end_date, last_entry_date nulls first, user_sweep_id\n`;
                break;
            }
            case `ended`: {
                where = this.BuildEndedSweepsWhere(user_sweep_search);
                order_by = `ORDER BY deleted_yn, end_date desc, user_sweep_id\n`;
                break;
            }
            case `won`: {
                where = this.BuildWonSweepsWhere(user_sweep_search);
                order_by = `ORDER BY end_date, user_sweep_id\n`;
                break;
            }
        }
        order_by = order_by + `LIMIT 20;`
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

    async GetSweepURL(id: number): Promise<URL> {
        const db = DbGetter.getDB();
        const q =
            `SELECT user_sweep_id\n` +
            `      ,coalesce(frequency_url, sweep_url) sweep_url\n` +
            `  FROM sweepimp.user_sweep\n` +
            ` WHERE user_sweep_id = $<id^>`;
        const result = await db.oneOrNone<Promise<URL>>(q, { id });
        this.ManageEntry([id]);
        return result;
    }

    async ToggleSweepState(column: string, id: number, state: boolean): Promise<user_sweep> {
        const db = DbGetter.getDB();
        // build new sweep
        const new_user_sweep = await this.getItem(id, `user_sweep_id`);
        switch (column){
            case `deleted_yn`: {
                new_user_sweep.deleted_yn = state;
                break;
            }
            case `won_yn`: {
                new_user_sweep.won_yn = state;
                break;
            }
        }
        return this.ManageSweep(new_user_sweep);
    }

    async ManageSweep(user_sweep: user_sweep): Promise<user_sweep> {
        if (await this.CheckSweepLimit(user_sweep)){
            if (user_sweep.user_sweep_id) { // existing sweep - update
                return this.UpdateSweep(user_sweep);
            } else { // new sweep - insert
                return this.InsertSweep(user_sweep);
            }
        }
    }

    Pad(direction: string, str: string, len: number, ch = `.`): string {
        len = len - str.length + 1;
        return len > 0 ?
            direction == 'left' ?
                new Array(len).join(ch) + str
                : str + new Array(len).join(ch)
            : str;
    }

    BuildTodoSweepsWhere(user_sweep_search: Search, status: string): string {
        let where = ``;
        var lastSweep = ``;
        const todoWhere =
            `   AND end_date >= now()\n` +
            `   AND deleted_yn = false\n` +
            `   AND won_yn = false\n`;
        switch (status) {
            case `today`: {
                where = where + todoWhere + 
                    `   AND date_trunc('DAY', last_entry_date) + (interval '1 DAY' * frequency_days) <= date_trunc('DAY', current_timestamp)\n`;
                break;
            }
            case `tomorrow`: {
                where = where + todoWhere +
                    `   AND date_trunc('DAY', last_entry_date) + (interval '1 DAY' * frequency_days) between date_trunc('DAY', current_timestamp)\n` +
                    `       AND date_trunc('DAY', current_timestamp) + interval '1 DAY'\n`;
                break;
            }
            case `later`: {
                where = where + todoWhere +
                `   AND date_trunc('DAY', last_entry_date) + (interval '1 DAY' * frequency_days) > date_trunc('DAY', current_timestamp) + interval '1 DAY'\n`;
                break;
            }
        }
        if (user_sweep_search.lastUserSweep) {
            lastSweep = (user_sweep_search.lastUserSweep.last_entry_date ? (user_sweep_search.lastUserSweep.frequency_days*24*60*60 - Math.floor((new Date(Date.UTC(new Date().getFullYear(), 0, 1)).getTime() - new Date(user_sweep_search.lastUserSweep.last_entry_date).getTime())/1000)).toString() : `0`)
                    + (user_sweep_search.lastUserSweep.end_date ? new Date(user_sweep_search.lastUserSweep.end_date).getTime().toString() : `0000000000000`)
                    + this.Pad(`left`, (user_sweep_search.lastUserSweep.user_sweep_id ? user_sweep_search.lastUserSweep.user_sweep_id : 0).toString(), 20, `0`);
            where = where +
                `   AND (coalesce((frequency_days*24*60*60 - floor((EXTRACT(EPOCH FROM date_trunc('YEAR', current_timestamp)) - EXTRACT(EPOCH FROM last_entry_date)))) :: text, '0')\n` +
                `     || coalesce((EXTRACT(EPOCH FROM end_date) * 1000) :: text, '0000000000000')\n` +
                `     || LPAD(user_sweep_id :: text, 20, '0')) :: numeric > ` + lastSweep + `\n`;
        }
        return where;
    }

    BuildActiveSweepsWhere(user_sweep_search: Search): string {
        let where = ``;
        var lastSweep = ``;
        where = where + 
            `   AND end_date >= now()\n`;
        if (user_sweep_search.lastUserSweep) {
            lastSweep = (user_sweep_search.lastUserSweep.deleted_yn ? 2 : 1).toString()
                    + (user_sweep_search.lastUserSweep.end_date ? new Date(user_sweep_search.lastUserSweep.end_date).getTime().toString() : `0000000000000`)
                    + (user_sweep_search.lastUserSweep.last_entry_date ? new Date(user_sweep_search.lastUserSweep.last_entry_date).getTime().toString() : `0000000000000`)
                    + this.Pad(`left`, (user_sweep_search.lastUserSweep.user_sweep_id ? user_sweep_search.lastUserSweep.user_sweep_id : 0).toString(), 20, `0`)
                    ;
            where = where + 
                `   AND (case deleted_yn when false then 1 else 2 end :: text\n` +
                `     || coalesce(floor(EXTRACT(EPOCH FROM end_date) * 1000) :: text, '0000000000000')\n` +
                `     || coalesce(floor(EXTRACT(EPOCH FROM last_entry_date) * 1000) :: text, '0000000000000')\n` +
                `     || LPAD(user_sweep_id :: text, 20, '0')) :: numeric > ` + lastSweep + `\n`;
        }
        return where;
    }

    BuildEndedSweepsWhere(user_sweep_search: Search): string {
        let where = ``;
        var lastSweep = ``;
        where = where +
            `   AND (  end_date BETWEEN now() - interval '1 month' AND now()\n` +
            `       OR won_yn = true)\n`;
        if (user_sweep_search.lastUserSweep) {
            lastSweep = (user_sweep_search.lastUserSweep.deleted_yn ? 2 : 1).toString()
                    + (user_sweep_search.lastUserSweep.end_date ? (9999999999999 - new Date(user_sweep_search.lastUserSweep.end_date.toString()).getTime()).toString() : `9999999999999`)
                    + this.Pad(`left`, (user_sweep_search.lastUserSweep.user_sweep_id ? user_sweep_search.lastUserSweep.user_sweep_id : 0).toString(), 20, `0`);
            where = where +
                `   AND (case deleted_yn when false then 1 else 2 end :: text\n` +
                `     || (9999999999999 - (coalesce(floor(EXTRACT(EPOCH FROM end_date) * 1000) :: text, '0000000000000') :: numeric)) :: text\n` +
                `     || LPAD(user_sweep_id :: text, 20, '0')) :: numeric > ` + lastSweep + `\n`;
        }
        return where;
    }

    BuildWonSweepsWhere(user_sweep_search: Search): string {
        let where = ``;
        var lastSweep = ``;
        where = where +
            `   AND won_yn = true\n` +
            `   AND deleted_yn = false\n` +
            `   AND EXTRACT(YEAR FROM end_date) = $<dateSearch.year^>\n` +
            (user_sweep_search.dateSearch.month ? `   AND EXTRACT(MONTH FROM end_date) = $<dateSearch.month^>\n` : ``);
        if (user_sweep_search.lastUserSweep) {
            lastSweep = (user_sweep_search.lastUserSweep.end_date ? new Date(user_sweep_search.lastUserSweep.end_date).getTime().toString() : `0000000000000`)
                    + this.Pad(`left`, (user_sweep_search.lastUserSweep.user_sweep_id ? user_sweep_search.lastUserSweep.user_sweep_id : 0).toString(), 20, `0`)
                    ;
            where = where +
                `   AND (coalesce(floor(EXTRACT(EPOCH FROM end_date) * 1000) :: text, '0000000000000')\n` +
                `     || LPAD(user_sweep_id :: text, 20, '0')) :: numeric > ` + lastSweep + `\n`;
        }
        return where;
    }

    async ManageEntry(sweep_ids: number[]) {
        const db = DbGetter.getDB();
        let insert =
            `INSERT INTO sweepimp.sweep_entry\n` +
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
        insert = insert.replace(new RegExp(`UNION ALL\n$`), `;`);
        const update =
            `UPDATE sweepimp.user_sweep\n` +
            `   SET total_entries = coalesce(total_entries, 0) + 1\n` +
            `      ,last_entry_date = current_timestamp\n` +
            `      ,updated = current_timestamp\n` +
            ` WHERE user_sweep_id IN ($<user_sweep_ids:csv>)`;
        await db.tx(`entry`, async DB => {
            await DB.oneOrNone(insert);
            await DB.oneOrNone(update, { user_sweep_ids: sweep_ids });
        });
    }

    async InsertSweep(user_sweep: user_sweep): Promise<user_sweep> {
        const db = DbGetter.getDB();
            return db.tx(`new-sweep`, innerDb => {
                return this.InsertSweepInner(innerDb, user_sweep);
            });
    }

    async CheckSweepLimit(new_user_sweep: user_sweep): Promise<boolean>{
        const db = DbGetter.getDB();
        const paymentPackage = await this.PaymentService.getCurrentPackage(new_user_sweep.user_account_id);
        const now = new Date();
        var sweepRevive = 0;
        if (!paymentPackage) {
            // user did not pick a plan
            throw new HttpException(`User does not have an active payment plan`, HttpStatus.FORBIDDEN);
        }
        var q = 
            `SELECT COUNT(*) active_sweeps\n` +
            `  FROM sweepimp.user_sweep\n` +
            ` WHERE user_account_id = $<user_account_id^>\n` +
            `   AND deleted_yn = false\n` +
            `   AND end_date >= now();`;
        const activeSweeps = await db.oneOrNone(q, new_user_sweep);
        // prevent sweep update to active if # of sweeps exceeded max
        if (new_user_sweep.user_sweep_id) { // existing sweep - update
            const existing_user_sweep = await this.getItem(new_user_sweep.user_sweep_id, `user_sweep_id`);
            if ((existing_user_sweep.deleted_yn && !new_user_sweep.deleted_yn) ||
                (existing_user_sweep.end_date < now && new_user_sweep.end_date > now)
                ){
                sweepRevive = 1;
            }
        }
        if (activeSweeps){
            if ((Number(activeSweeps.active_sweeps) + (new_user_sweep.user_sweep_id ? sweepRevive : 1)) > paymentPackage.max_active_sweeps){
                throw new HttpException(`User monthly active sweeps reached plan maxinum (` + paymentPackage.max_active_sweeps.toString() + `)`, HttpStatus.FORBIDDEN);
            }
        }
        return true;
    }

    async UpdateSweep(user_sweep: user_sweep): Promise<user_sweep> {
        const db = DbGetter.getDB();
        const old_user_sweep = await this.getItem(user_sweep.user_sweep_id, `user_sweep_id`);
        return db.tx(`update-sweep`, innerDb => {
            return this.UpdateSweepInner(innerDb, user_sweep, old_user_sweep);
        });
    }

    async UpdateSweepInner(DB, user_sweep: user_sweep, old_user_sweep: user_sweep): Promise<user_sweep> {
        const ChangedColumns = this.GetChangedColumns(user_sweep, old_user_sweep);
        //case each line
        const q = this.BuildUpdateString(ChangedColumns);
        var UserSweep;
        if (q){
            UserSweep = await DB.one(q, user_sweep);
        } else {
            UserSweep = old_user_sweep
        }
        return UserSweep;
    }

    async InsertSweepInner(DB, user_sweep: user_sweep): Promise<user_sweep> {
        let q =
            `INSERT INTO sweepimp.user_sweep\n` +
            `    (user_account_id\n` +
            `    ,sweep_name\n` +
            `    ,sweep_url\n` +
            `    ,end_date\n` +
            `    ,is_frequency\n` +
            `    ,frequency_url\n` +
            `    ,frequency_days\n` +
            `    ,last_entry_date\n` +
            `    ,total_entries\n` +
            `    ,is_referral\n` +
            `    ,referral_url\n` +
            `    ,total_shares\n` +
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
            `    ,current_timestamp\n` +
            `    ,1\n` +
            `    ,$<is_referral>\n` +
            `    ,$<referral_url>\n` +
            `    ,0\n` +
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
        return DB.one(q, user_sweep);
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
        // convert strings to types for better comparison
        old_user_sweep.end_date = old_user_sweep.end_date ? new Date(old_user_sweep.end_date) : null;
        old_user_sweep.frequency_days = old_user_sweep.frequency_days ? +old_user_sweep.frequency_days : null;
        old_user_sweep.referral_frequency = old_user_sweep.referral_frequency ? +old_user_sweep.referral_frequency : null;
        new_user_sweep.end_date = new_user_sweep.end_date ? new Date(new_user_sweep.end_date) : null;
        new_user_sweep.frequency_days = new_user_sweep.frequency_days ? +new_user_sweep.frequency_days : null;
        new_user_sweep.referral_frequency = new_user_sweep.referral_frequency ? +new_user_sweep.referral_frequency : null;

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
        var flag = false;
        Object.keys(ChangedColumns).forEach(key => {
            if (ChangedColumns[key]){
                UserSweepColumns = UserSweepColumns + `      ,` + this.Pad(`right`, key, 22, ` `) + ` = $<` + key + `>\n`;
                flag = true;
            }
        });
        return (flag ?
            `UPDATE sweepimp.user_sweep\n` +
            `   SET ` + UserSweepColumns +
            ` WHERE user_sweep_id = $<user_sweep_id^>\n` +
            `RETURNING *` : ``);
    }

    async GetSweepURLs(id: number): Promise<string[]> {
        const db = DbGetter.getDB();
        const q =
            `SELECT user_sweep_id\n` +
            `      ,coalesce(frequency_url, sweep_url) sweep_url\n` +
            `  FROM sweepimp.user_sweep\n` +
            ` WHERE user_account_id = $<id^>\n` +
            `   AND end_date >= now()\n` +
            `   AND (  last_entry_date is null\n` +
            `       OR last_entry_date < current_date - interval '1 DAY' * frequency_days)`;
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
                console.log(`Error in ManageEntry`);
            }
        }
        return urls;
    }
}