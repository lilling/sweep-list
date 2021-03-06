import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import * as path from 'path';
import * as express from 'express';
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';
import { DbGetter } from './dal/DbGetter';
import { isDebugMode } from '../../debugMode';

async function bootstrap() {
    const httpsOptions = {
        key: fs.readFileSync('./ssl/private.key'),
        cert: fs.readFileSync('./ssl/certificate.crt'),
    };

    DbGetter.getDB();
    const server = express();
    const app = await NestFactory.create(ApplicationModule, server);
    app.use(express.static(path.join(__dirname, '../../dist')));
    server.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(__dirname, '../../dist/index.html'));
    });
    await app.init();

    http.createServer(server).listen(3000);
    if (isDebugMode.getMode()){
        https.createServer(httpsOptions, server).listen(443);
    }
}

bootstrap();
