import * as pgtools from 'pgtools';
import { createConnection, Connection } from 'typeorm';
import { User } from './entity/User';

export class DbInitializer {
    static connection: Connection;

    static async initDb() {
        try {
            this.connection = await createConnection();
            await this.addUser();
            return this.connection;
        } catch (err) {
            await this.createDb();

            return this.connection;
        }
    }

    static async addUser() {
        console.log("Inserting a new user into the database...");
        const user = new User();
        user.firstName = "Timber";
        user.lastName = "Saw";
        user.age = 25;
        await this.connection.manager.save(user);
        console.log("Saved a new user with id: " + user.id);

        console.log("Loading users from the database...");
        const users = await this.connection.manager.find(User);
        console.log("Loaded users: ", users);

        console.log("Here you can setup and run express/koa/any other framework.");
    }

    private static createDb() {
        const schemaConfig = {
            user: 'postgres',
            password: '123',
            port: 5432,
            host: 'localhost'
        };
        console.log('Creating schema...');
        pgtools.createdb(schemaConfig, 'sweepList', async err => {
            if (err) {
                console.error(err);
                process.exit(-1);
            }
            console.log('schema built');
            this.connection = await createConnection();
            await this.addUser();
        });
    }

}
