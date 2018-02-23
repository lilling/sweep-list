import { Get, Controller } from '@nestjs/common';
import { user } from './dal/DB';
import { DbGetter } from './dal/DbGetter';

@Controller()
export class AppController {
    @Get('b')
    root(): string {
        return 'Hello World!';
    }

    @Get('DBtest')
    DBtest(): string {
        const db = DbGetter.getDB();
        const q = 'select * from sweepimp.user';
        db.each(q, [], (User: user) => {
            const user_id = User.user_id;
            const first_name = User.first_name;
            const last_name = User.last_name;
            const created = User.created;
            const updated = User.updated;
            console.log(user_id + ' - ' + first_name + ' - ' + last_name + ' - ' + created + ' - ' + updated);
        }).catch(error => console.log('failed to query db', error));
        return 'Hello DB!';
    }
}
