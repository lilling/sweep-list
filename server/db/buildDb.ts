import * as pgtools from 'pgtools';
import * as config from 'config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const connectionData = config.get<PostgresConnectionOptions>('db');
const schemaConfig = {
    user: connectionData.username,
    password: connectionData.password,
    port: connectionData.port,
    host: connectionData.host
};

pgtools.dropdb(schemaConfig, connectionData.database, (err, res) => {
    console.log('droping db');
    if (err && err.message === 'database "sweeps" does not exist') {
        console.log('db wasn`t found');
        console.log(err);
        process.exit(-1);
    } else {
        console.log('create db');
        pgtools.createdb(schemaConfig, connectionData.database, (err, res) => {
            if (err) {
                console.log(err);
                process.exit(-1);
            }
            console.log('db created');
        });
    }
});
