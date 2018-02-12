import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as pgtools from 'pgtools';
import * as config from 'config';
import { User } from './entity/User';

export class DbInitilizer {
    static connectionData = config.get<PostgresConnectionOptions>('db');

    static async initDB() {
        createConnection().then(async connection => {
            console.log('Inserting a new user into the database...');
            const user = new User();
            user.firstName = 'Timber';
            user.lastName = 'Saw';
            user.age = 25;
            await connection.manager.save(user);
            console.log('Saved a new user with id: ' + user.id);

            console.log('Loading users from the database...');
            const users = await connection.manager.find(User);
            console.log('Loaded users: ', users);

            console.log('Here you can setup and run express/koa/any other framework.');

        }).catch(error => {
            console.log(error);
			if (error.message.includes('sweeps')) {
				this.createDb();
			}
        });
    }

    private static createDb() {
        const schemaConfig = {
            user: this.connectionData.username,
            password: this.connectionData.password,
            port: this.connectionData.port,
            host: this.connectionData.host
        };

        pgtools.createdb(schemaConfig, this.connectionData.database, (err, res) => {
            if (err) {
                console.log(err);
                process.exit(-1);
            }
        });
    }
}