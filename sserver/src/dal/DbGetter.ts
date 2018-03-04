import * as pgPromise from 'pg-promise';
import { IDatabase } from 'pg-promise';

import * as pgMonitor from 'pg-monitor';
const pgOptions = {};
const pgConnect = {
    host: 'ec2-79-125-110-209.eu-west-1.compute.amazonaws.com',
    port: 5432,
    database: 'd3aah4o2s9brq6',
    user: 'uatfbjfsevdoty',
    password: 'c0b2db4f5ee255f2510523d840db63919ee59b6f58a24f3f0f7b7b09e917947a',
    ssl: true,};

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
