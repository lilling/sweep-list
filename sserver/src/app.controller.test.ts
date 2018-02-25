import { Get, Controller } from '@nestjs/common';
import { user } from './dal/DB';
import { UserObj } from './dal/UserDal';
import { DbGetter } from './dal/DbGetter';

@Controller()
export class AppController {
    @Get('b')
    root(): string {
        return 'Hello World!';
    }

    @Get('DBtest')
    DBtest(): string {
        var start = Date.now();
//        const db = DbGetter.getDB();
//        const q = 'select * from sweepimp.user';
//        db.each(q, [], (User: user) => {
/*            const user_id = User.user_id;
            const first_name = User.first_name;
            const last_name = User.last_name;
            const created = User.created;
            const updated = User.updated;
            console.log(user_id + ' - ' + first_name + ' - ' + last_name + ' - ' + created + ' - ' + updated);*/
//            console.log(User.user_id + ' - ' + User.first_name + ' - ' + User.last_name + ' - ' + User.created + ' - ' + User.updated);
//        }).catch(error => console.log('failed to query db', error));
const user = UserObj.Create()
    return 
}

        console.log("milliseconds elapsed = " + Math.floor(Date.now() - start));
        return 'New User ID: ' + ;
    }
}
