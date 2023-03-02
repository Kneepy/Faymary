import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {APP_PORT} from "./app.constants";
import * as cookieParser from "cookie-parser"
import { ICustomRequest } from './types/request.type';

(async () => {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    app.use((req: ICustomRequest, res, next) => {
        if (req.headers.authorization) {
            const authorizationHeader = req.headers.authorization.split(" ");
            if (authorizationHeader[0] === "Bearer") {
                req.headers.authorization = authorizationHeader[1];
            }
        }
        if(req.headers.refresh_token) {
            const refreshTokenHeader = req.headers.refresh_token.split(" ");
            if (refreshTokenHeader[0] === "Bearer") {
                req.headers.refresh_token = refreshTokenHeader[1];
            }
        }
        next();
    });

    await app.listen(APP_PORT);
    Logger.log("Broker service successfully started")
})()
