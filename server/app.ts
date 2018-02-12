import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as compression from 'compression';
import * as forceSsl from 'express-force-ssl';

class App {

    public express: express.Application;
    private server: https.Server;

    constructor() {
        this.express = express();
        this.middleware();
        this.initRoutes();
        this.initServer();
        this.listen();
    }

    private middleware(): void {
        this.express.use(forceSsl);
        this.express.use(compression());
        this.express.use(bodyParser.urlencoded({limit: '50mb', extended: true}) as express.RequestHandler);
        this.express.use(bodyParser.json({limit: '50mb'}) as express.RequestHandler);
    }

    private initRoutes(): void {
        this.express.use(express.static(path.join('../dist')));

        this.express.use(/^\/(?!api).*/, (req, res) => {
            res.sendFile(path.join('../dist/index.html'));
        });
        this.express.use('/api', (req, res) => {
            res.status(200).send('hello');
        });
    }

    private initServer() {
        const certs = this.getSslCerts();
        this.initRedirectServer();
        return this.server = https.createServer(certs, this.express);
    }

    private getSslCerts(): { key: Buffer, cert: Buffer } {
        try {
            const key = fs.readFileSync(path.join(__dirname, './ssl/localhost.key'));
            const cert = fs.readFileSync(path.join(__dirname, './ssl/localhost.crt'));
            return {key, cert};
        } catch (err) {
            console.log(`An error occurred while getting certs - ${err}`);
        }

    }

    private listen() {
        const port = process.env.port || 443;
        this.server.listen(port, () => {
            console.log(`server running on port: ${port}`);
        });
        this.handleServerError(this.server, port);
    }

    private initRedirectServer(): void {
        // TODO - use NGINX in the future as https and http redirect server
        const redirectServer = http.createServer(this.express); // For forwarding of all requests to HTTPS
        this.handleServerError(redirectServer, 80, true);
        redirectServer.listen(80);
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
        });
    }
}


export default new App().express;
