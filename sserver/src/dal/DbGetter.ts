import * as pgPromise from 'pg-promise';
import { IDatabase } from 'pg-promise';

import * as pgMonitor from 'pg-monitor';
const pgOptions = {};
const pgConnect = {
    host: 'hard-plum.db.elephantsql.com',
    port: 5432,
    database: 'hsrbfqoh',
    user: 'hsrbfqoh',
    password: 'OASQR0O7qDLnHlIBgWcHiD_dKwz4dBoM',};

export class DbGetter {
    private static db: IDatabase<any>;

    static getDB() {
        if (!this.db) {
            this.db = pgPromise(pgOptions)(pgConnect);
            pgMonitor.attach(pgOptions);
        }
        return this.db;
    }
}
