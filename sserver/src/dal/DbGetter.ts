import * as pgPromise from 'pg-promise';
import { IDatabase } from 'pg-promise';
import * as pgMonitor from 'pg-monitor';
import { isDebugMode } from '../../../debugMode';

const pgOptions = {};
const pgConnect = {
    host: '35.184.77.103',
    port: 5432,
    database: 'd75paaqoaj1vte',
    user: 'hugvfezcdslezy',
    password: 'k7t9dw3WFkVDEAV8cjPrGkcCSuxkfmzTDu4Sc3M6cPLQw4CPHNJrRfNz2UpuQt4u',
    ssl: true,
};

export class DbGetter {
    private static db: IDatabase<any>;

    static getDB() {
        if (!this.db) {
            this.db = pgPromise(pgOptions)(pgConnect);
console.log(isDebugMode.getMode());
            if (isDebugMode.getMode()){
                pgMonitor.attach(pgOptions);
            }
        }
        return this.db;
    }
}
