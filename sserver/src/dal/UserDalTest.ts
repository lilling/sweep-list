import { user } from './DB';
import { DbGetter } from './DbGetter';
import { SocialMedia } from '../../../src/app/models/social-media.enum';
import * as pgPromise from 'pg-promise';
import { IDatabase } from 'pg-promise';


export class UserObj{
    Create(User: user): Promise<pgPromise.IArrayExt<any>>{
        const db = DbGetter.getDB();
        const q = 'insert into sweepimp.user\n' +
        'select ${first_name} as first, ${last_name} as last, current_timestamp as insert, current_timestamp as update RETURNING user_id';
        let user_id = db.any(q, {first_name: /*User.first_name*/'Dovi Test', last_name: /*User.last_name*/'Lilling Test'});
        console.log(user_id);
        return user_id;
    }

    Get(authToken: string, SocialMedia: SocialMedia): Promise<pgPromise.IArrayExt<any>>{
        const db = DbGetter.getDB();
        const q = 'SELECT us.user_id\n' +
                  '  FROM sweepimp.user_social       us\n' +
                  '  JOIN sweepimp.social_media_field usf using (social_media_field_id)\n' +
                  ' WHERE usf.is_token_yn             = true\n' +
                  '   AND us.social_media_id          = ${SocialMedia}\n'
                  '   AND us.social_media_field_value = ${authToken}\n';
        let user_id = db.any(q, {
            SocialMedia: SocialMedia,
            authToken: authToken
        });
/*        db.any(q, {
            SocialMedia: SocialMedia,
            authToken: authToken
        }).then( user_id => {
            const user_id = User.user_id;
            const first_name = User.first_name;
            const last_name = User.last_name;
            const created = User.created;
            const updated = User.updated;
            console.log(user_id + ' - ' + first_name + ' - ' + last_name + ' - ' + created + ' - ' + updated);
        }).catch(error => console.log('failed to query db', error));*/
        console.log(user_id);
        return user_id;
    }
}