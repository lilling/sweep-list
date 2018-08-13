import * as pgPromise from 'pg-promise';
import { IDatabase } from 'pg-promise';

import * as pgMonitor from 'pg-monitor';

const pgOptions = {};
const pgConnect = {
    host: 'ec2-54-217-235-159.eu-west-1.compute.amazonaws.com',
    port: 5432,
    database: 'd75paaqoaj1vte',
    user: 'hugvfezcdslezy',
    password: '6eaf13be7971e2bdf1c9457c84efa4f141fd5ae2e1f26e16fcfe3dfb7965c90b',
    ssl: true,
};

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
