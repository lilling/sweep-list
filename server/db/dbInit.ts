import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as config from 'config';

export class DbInitializer {
    static connectionData = config.get<PostgresConnectionOptions>('db');

    static async initDB() {
        console.log('validating connection to db');
        try {
            await createConnection();
            console.log('connection is valid');
        } catch (err) {
            console.log(err);
        }
    }
}
