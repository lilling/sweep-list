import { DbGetter } from '../dal/DbGetter';
import { BaseService } from './base.service';
import { PostToPublishRaw, PostToPublish, user_sweep, user_sweep_display } from '../../../shared/classes';
import { promise } from 'selenium-webdriver';
import { SocialMedia } from '../../../src/app/models/social-media.enum';

export class ServerService extends BaseService<PostToPublish> {
    constructor() {
        super('dummy');
    }

    async GetPostsToPublish(): Promise<PostToPublish[]>{
        const db = DbGetter.getDB();
//TODO: treat every social media by itself (its own max(share_date))
        let q =
            `SELECT us.user_account_id\n` +
            `      ,us.user_sweep_id\n` +
            `      ,COALESCE(us.referral_url, us.sweep_url) link\n` +
            `      ,us.personal_refer_message message\n` +
            `      ,us.refer_google\n` +
            `      ,us.refer_facebook\n` +
//            `      ,us.refer_twitter\n` +
  //          `      ,us.refer_linkedin\n` +
    //        `      ,us.refer_pinterest\n` +
            `  FROM sweepimp.user_sweep us\n` +
            ` WHERE us.is_referral = true\n` +
            `   AND us.end_date >= now()\n` +
            `   AND us.referral_frequency < DATE_PART('day', now() - (SELECT COALESCE(MAX(share_date), now() - interval '1 year')\n` +
            `                                                           FROM sweepimp.sweep_share ss\n` +
            `                                                          WHERE ss.user_sweep_id = us.user_sweep_id)\n` +
            `                                        )`;
        const RawSweepsToPublish = await db.manyOrNone(q);
        RawSweepsToPublish.forEach(PostToPublish => {
            this.ShareSweep(PostToPublish);
        });
        return;
    };

    async ShareSweep(PostToPublish: PostToPublishRaw){
        const db = DbGetter.getDB();
        // get the user social media credentials
        var Providers = [];
        if (PostToPublish.refer_google){Providers.push('google')};
        if (PostToPublish.refer_facebook){Providers.push('facebook')};
//            if (PostToPublish.refer_twitter){Providers.push('twitter')};
//          if (PostToPublish.refer_linkedin){Providers.push('linkedin')};
//        if (PostToPublish.refer_pinterest){Providers.push('pinterest')};
        let allProvidersQuery = ``;
        Providers.forEach(Provider => {
            allProvidersQuery = allProvidersQuery +
                `SELECT '${Provider}' provider, acc.*\n` +
                `  FROM sweepimp.${Provider}_account acc\n` +
                ` WHERE user_account_id = $<user_account_id^>;\n`;
        });
        let allProvidersCred = await db.multi(allProvidersQuery, PostToPublish);
//        console.log(PostToPublish);
  //      console.log(allProvidersCred);
        let sweepShareDMLs = ``;
        let shareCount = 0;
        Providers.forEach(Provider => {
//TODO: complete share sweep procedure - actually post something
//        let postID = This.PostSweep();
            let shareID = Provider + ' ' + PostToPublish.user_sweep_id + ' PostID_Dummy';
            sweepShareDMLs = sweepShareDMLs +
                `INSERT INTO sweepimp.sweep_share\n` +
                `    (user_sweep_id\n` +
                `    ,social_media_id\n` +
                `    ,share_date\n` +
                `    ,share_id\n` +
                `    ,created\n` +
                `    ,updated)\n` +
                `VALUES \n` +
                `    ($<user_sweep_id^>\n` +
                `    ,(SELECT social_media_id FROM sweepimp.social_media WHERE social_media_name = '${Provider}')\n` +
                `    ,current_timestamp\n` +
                `    ,'${shareID}'\n` +
                `    ,current_timestamp\n` +
                `    ,current_timestamp);\n`;
            shareCount++;
        });
        console.log(PostToPublish);
        sweepShareDMLs = sweepShareDMLs +
            `UPDATE sweepimp.user_sweep_display\n` +
            `   SET total_shares = total_shares + ${shareCount}\n` +
            `      ,updated      = current_timestamp\n` +
            ` WHERE user_sweep_id = $<user_sweep_id^>\n`;
        db.multi(sweepShareDMLs, PostToPublish);
    };

/*
    async GetSweeps(id: number, status: string, year?: number, month?: number): Promise<user_sweep_display[]>{
        const db = DbGetter.getDB();
        let q =
            `SELECT *\n` +
            `  FROM sweepimp.user_sweep_display\n` +
            ` WHERE user_account_id = $<id^>\n`;
        let where = ``;
        let order_by = ``;
        switch(status){
            case 'live':{
                where = `   AND end_date >= now()\n`;
                order_by = `ORDER BY deleted_yn, last_entry_date, end_date desc;`;
                break;
            }
            case 'ended':{
                where =
                    `   AND (  end_date BETWEEN now() - interval '1 month' AND now()\n` +
                    `       OR won_yn = true)\n`
                ;
                order_by = `ORDER BY deleted_yn, end_date desc;`;
                break;
            }
            case 'won':{
                where =
                    `   AND won_yn = true\n`+
                    `   AND EXTRACT(YEAR FROM end_date) = ${year}\n`+
                    (month ? `   AND EXTRACT(MONTH FROM end_date) = ${month}\n` : ``)
                ;
                break;
            }
        }
        return db.manyOrNone(q + where + order_by, {id: id});
    }

    async GetWins(id: number): Promise<win[]>{
        const db = DbGetter.getDB();
        let q =
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
        return db.manyOrNone(q, {id: id});
    }

    async GetSweepURL(id: number): Promise<string>{
        const db = DbGetter.getDB();
        let q =
            `SELECT user_sweep_id\n` +
            `      ,sweep_url\n` +
            `  FROM sweepimp.user_sweep\n` +
            ` WHERE user_sweep_id = $<id^>`;
        var result = await db.oneOrNone<Promise<URL>>(q, {id: id});
        this.ManageEntry([id]);
        return result.sweep_url;
    }

    async GetSweepURLs(id: number): Promise<string[]>{
        const db = DbGetter.getDB();
        let q =
            `SELECT user_sweep_id\n` +
            `      ,sweep_url\n` +
            `  FROM sweepimp.user_sweep_display\n` +
            ` WHERE user_account_id = $<id^>\n` +
            `   AND end_date >= now()\n`;
        let sweeps = [];
        let urls = [];
        var result = await db.manyOrNone<URL>(q, {id: id});
        result.forEach(value => {
            sweeps.push(value.user_sweep_id);
            urls.push(value.sweep_url);
        });
        await this.ManageEntry(sweeps);
//TODO: why returns URLs when ManageEntry is with error (force an error by adding a space in a query)?
        return urls;
    }

    async ManageEntry(sweep_ids: number[]){
        const db = DbGetter.getDB();
        let inserts = ``;
        sweep_ids.forEach(value => {
            inserts = inserts + 
                'INSERT INTO sweepimp.sweep_entry\n' +
                `    (user_sweep_id\n` +
                `    ,entry_date\n` +
                `    ,created\n` +
                `    ,updated)\n` +
                `VALUES \n` +
                `    (${value}\n` +
                `    ,current_timestamp\n` +
                `    ,current_timestamp\n` +
                `    ,current_timestamp);\n`;
            });
        let update =
            `UPDATE sweepimp.user_sweep_display\n` +
            `   SET total_entries = coalesce(total_entries, 0) + 1\n` +
            ` WHERE user_sweep_id IN ($<user_sweep_ids:csv>)`;
        await db.tx(DB => {
            DB.multi(inserts);
            DB.none(update, {user_sweep_ids: sweep_ids});
        });
    }

    async ToggleSweepState(column: string, id: number, state: boolean): Promise<user_sweep_display>{
        const db = DbGetter.getDB();
        return db.tx((state ? '' : 'un') + column.replace('_yn', '') + '-sweep', db => {
            return this.ToggleSweepStateInner(db, column, id, state);
        });
    }

    async ToggleSweepStateInner(DB, column: string, id: number, state: boolean): Promise<user_sweep_display>{
        let q =
            `UPDATE sweepimp.user_sweep\n` +
            `   SET $<column:name> = $<state_yn>\n` +
            `      ,updated = current_timestamp\n` +
            ` WHERE user_sweep_id = $<user_sweep_id^>;\n` +
            `UPDATE sweepimp.user_sweep_display\n` +
            `   SET $<column:name> = $<state_yn>\n` +
            `      ,updated = current_timestamp\n` +
            ` WHERE user_sweep_id = $<user_sweep_id^>\n` +
            `RETURNING *`;
        let UserSweepDisplay = await DB.multi(q, {column: column, state_yn: state, user_sweep_id: id});
        return UserSweepDisplay[1][0];
    }

    async ManageSweep(user_sweep: user_sweep): Promise<user_sweep_display>{
        if (user_sweep.user_sweep_id){ // existing sweep - update
            return this.UpdateSweep(user_sweep);
        } else { // new sweep - insert
            return this.InsertSweep(user_sweep);
        }
    }

    async InsertSweep(user_sweep: user_sweep): Promise<user_sweep_display>{
        const db = DbGetter.getDB();
        return db.tx('new-sweep', db => {
            return this.InsertSweepInner(db, user_sweep);
        });
    }

    async UpdateSweep(user_sweep: user_sweep): Promise<user_sweep_display>{
        const db = DbGetter.getDB();
        return db.tx('update-sweep', db => {
            return this.UpdateSweepInner(db, user_sweep);
        });
    }

    async InsertSweepInner(DB, user_sweep: user_sweep): Promise<user_sweep_display>{
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

    async UpdateSweepInner(DB, user_sweep: user_sweep): Promise<user_sweep_display>{
        let q =
            `UPDATE sweepimp.user_sweep\n` +
            `   SET sweep_name             = $<sweep_name>\n` +
            `      ,sweep_url              = $<sweep_url>\n` +
            `      ,end_date               = $<end_date>\n` +
            `      ,is_frequency           = $<is_frequency>\n` +
            `      ,frequency_url          = $<frequency_url>\n` +
            `      ,frequency_days         = $<frequency_days>\n` +
            `      ,is_referral            = $<is_referral>\n` +
            `      ,referral_url           = $<referral_url>\n` +
            `      ,referral_frequency     = $<referral_frequency>\n` +
            `      ,personal_refer_message = $<personal_refer_message>\n` +
            `      ,refer_facebook         = $<refer_facebook>\n` +
            `      ,refer_twitter          = $<refer_twitter>\n` +
            `      ,refer_google           = $<refer_google>\n` +
            `      ,refer_linkedin         = $<refer_linkedin>\n` +
            `      ,refer_pinterest        = $<refer_pinterest>\n` +
            `      ,thanks_to              = $<thanks_to>\n` +
            `      ,thanks_social_media_id = $<thanks_social_media_id>\n` +
            `      ,won_yn                 = $<won_yn>\n` +
            `      ,prize_value            = $<prize_value>\n` +
            `      ,updated                = current_timestamp\n` +
            ` WHERE user_sweep_id = $<user_sweep_id^>;\n` +
            `UPDATE sweepimp.user_sweep_display\n` +
            `   SET sweep_name             = $<sweep_name>\n` +
            `      ,sweep_url              = $<sweep_url>\n` +
            `      ,end_date               = $<end_date>\n` +
            `      ,is_frequency           = $<is_frequency>\n` +
            `      ,frequency_url          = $<frequency_url>\n` +
            `      ,is_referral            = $<is_referral>\n` +
            `      ,referral_url           = $<referral_url>\n` +
            `      ,thanks_to              = $<thanks_to>\n` +
            `      ,thanks_social_media_id = $<thanks_social_media_id>\n` +
            `      ,won_yn                 = $<won_yn>\n` +
            `      ,updated                = current_timestamp\n` +
            ` WHERE user_sweep_id = $<user_sweep_id^>\n` +
            `RETURNING *`;
        let UserSweepDisplay = await DB.multi(q, user_sweep);
        return UserSweepDisplay[1][0];
    }*/
}