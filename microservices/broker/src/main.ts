import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {APP_PORT} from "./app.constants";

(async () => {
    const app = await NestFactory.create(AppModule);
    await app.listen(APP_PORT);
})()
