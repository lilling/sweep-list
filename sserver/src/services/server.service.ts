import { DbGetter } from '../dal/DbGetter';
import { BaseService } from './base.service';
import { PostToPublishRaw, PostToPublish, user_sweep } from '../../../shared/classes';
import { promise } from 'selenium-webdriver';
import { SocialMedia } from '../../../shared/models/social-media.enum';
import { FacebookService } from './facebook.service'

export class ServerService extends BaseService<PostToPublish> {
    FacebookService: FacebookService;

    constructor() {
        super('dummy');
        this.FacebookService = new FacebookService();
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

    async ShareSweep(RawPostToPublish: PostToPublishRaw){
        const db = DbGetter.getDB();
        // get the user social media credentials
        var Providers = [];
        if (RawPostToPublish.refer_google){Providers.push('google')};
        if (RawPostToPublish.refer_facebook){Providers.push('facebook')};
//            if (RawPostToPublish.refer_twitter){Providers.push('twitter')};
//          if (RawPostToPublish.refer_linkedin){Providers.push('linkedin')};
//        if (RawPostToPublish.refer_pinterest){Providers.push('pinterest')};
        let allProvidersQuery = ``;
        Providers.forEach(Provider => {
            allProvidersQuery = allProvidersQuery +
                `SELECT '${Provider}' provider, acc.*\n` +
                `  FROM sweepimp.${Provider}_account acc\n` +
                ` WHERE user_account_id = $<user_account_id^>;\n`;
        });
        let allProvidersCred = await db.multi(allProvidersQuery, RawPostToPublish);
//        console.log(RawPostToPublish);
        //console.log(allProvidersCred);
        //console.log(RawPostToPublish);
        let sweepShareDMLs = ``;
        let shareCount = 0;
        let FinalPostToPublish;
        Providers.forEach(Provider => {
            FinalPostToPublish = new PostToPublish(RawPostToPublish, allProvidersCred.find(element => element[0].provider == Provider)[0]);
            //TODO: scale. Have to wait for shareID, but need to parallel this.
            let shareID = this.PostSweep(FinalPostToPublish);
            if (shareID){
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
            }
        });
        sweepShareDMLs = sweepShareDMLs +
            `UPDATE sweepimp.user_sweep\n` +
            `   SET total_shares = total_shares + ${shareCount}\n` +
            `      ,updated      = current_timestamp\n` +
            ` WHERE user_sweep_id = $<user_sweep_id^>\n`;
        db.multi(sweepShareDMLs, FinalPostToPublish);
    };

    PostSweep(PostToPublish: PostToPublish): string{
        let PostID = null;
        switch (PostToPublish.provider){
            case 'facebook': {
                return this.FacebookService.publishPost(PostToPublish.auth_token, PostToPublish.provider_account_id.toString(), PostToPublish.message, PostToPublish.link);
            }
        }
        return PostID;
    }
}