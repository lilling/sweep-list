import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as https from 'https';
import {createConnection} from "typeorm";
import * as http from 'http';
import * as fs from 'fs';
import * as compression from 'compression';
import * as forceSsl from 'express-force-ssl';
import { User } from './db/entity/User';
//

export class App {

    public express: express.Application;
    private server: https.Server;

    public static bootstrap(): App {
        const app = new App();
        this.initDB();
        return app;
    }
    constructor() {
        this.initExpress();
        this.middleware();
        this.initRoutes();
        this.initServer();
        this.listen();
    }

    private initExpress(): void {
        this.express = express();
    }

    private static initDB() {
        createConnection().then(async connection => {

            console.log("Inserting a new user into the database...");
            const user = new User();
            user.firstName = "Timber";
            user.lastName = "Saw";
            user.age = 25;
            await connection.manager.save(user);
            console.log("Saved a new user with id: " + user.id);

            console.log("Loading users from the database...");
            const users = await connection.manager.find(User);
            console.log("Loaded users: ", users);

            console.log("Here you can setup and run express/koa/any other framework.");

        }).catch(error => console.log(error));
    }

    private middleware(): void {
        this.express.use(forceSsl);
        this.express.use(compression());
        this.express.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
            next();
        });
        this.express.use(bodyParser.urlencoded({ limit: '50mb', extended: true}) as express.RequestHandler);
        this.express.use(bodyParser.json({ limit: '50mb' }) as express.RequestHandler);
    }

    private initRoutes(): void {
        // placeholder route handler
        this.express.use('/', (req, res, next) => { res.send('hello!')});
    }

    private initServer() {
        const certs = this.getSslCerts();
        this.initRedirectServer();
        return this.server = https.createServer(certs, this.express);
    }

    private listen() {
        const port = 443;
        this.server.listen(port, () => {
            console.log(`server running on port: ${port}`);
        });
        this.handleServerError(this.server, port);
    }

    private initRedirectServer(): void {
        const redirectServer = http.createServer(this.express); // For forwarding of all requests to HTTPS
        this.handleServerError(redirectServer, 80, true);
        redirectServer.listen(80);
    }

    private getSslCerts() {
        try {
            const key = fs.readFileSync('ssl/localhost.key');
            const cert = fs.readFileSync('ssl/localhost.crt');
            return { key, cert };
        } catch (err) {
            console.log(`An error occurred while getting certs - ${err}`);
        }

    }

    private handleServerError(server: http.Server | https.Server, port: number, redirector?: boolean): void {
        server.on('error', (error) => {
            if (error.syscall !== 'listen') {
                throw error;
            }
            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(port + 'requires elevated privileges');
                    if (!redirector) {
                        process.exit(1);
                    }
                    break;
                case 'EADDRINUSE':
                    console.error(port + 'is already in use');
                    if (!redirector) {
                        process.exit(1);
                    }
                    break;
                default:
                    throw error;
            }
        })
    }
}
