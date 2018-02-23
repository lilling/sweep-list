import {Get, Controller } from '@nestjs/common';
import {user} from './dal/DB';
//import {db} from './dal/DBinit.module';

var db = require('../queries');

@Controller()
export class AppController {
    @Get('b')
    root(): string {
        return 'Hello World!';
    }

    @Get('DBtest')
    DBtest(): string {
        let q = 'select * from sweepimp.user'
        db.each(q, [], (User: user) => {
            const user_id = User.user_id;
            const first_name = User.first_name;
            const last_name = User.last_name;
            const created = User.created;
            const updated = User.updated;
            console.log(user_id + ' - ' + first_name+ ' - ' + last_name+ ' - ' + created+ ' - ' + updated)
        }).catch(error => console.error('failed to query db', error))
        return 'Hello DB!';
    }
}
