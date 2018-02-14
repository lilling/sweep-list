import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);
    app.use(express.static(path.join(__dirname, '../../dist')));
    await app.listen(3000);
}
bootstrap();
