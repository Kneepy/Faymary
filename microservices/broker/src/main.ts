import { WsAdapter } from '@nestjs/platform-ws';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {APP_PORT, REQUEST_FIELD_ACCESS_TOKEN} from "./constants/app.constants";
import { ICustomRequest } from './types/request.type';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';

(async () => {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

    app.useWebSocketAdapter(new WsAdapter(app));
    app.use((req: ICustomRequest, res, next) => {
        if (req.headers.authorization) {
            const authorizationHeader = req.headers[REQUEST_FIELD_ACCESS_TOKEN].split(" ");
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
    await app.register(fastifyCookie)
    
    /**
     * Нужно будет поменять origin на конкретный хост FE
     */
    app.enableCors({origin: "http://localhost:3000", credentials: true, exposedHeaders: ["authorization", "set-cookie"]});

    await app.listen(APP_PORT);
    Logger.log("Broker service successfully started")

    /**
     * Устанавливает кол-во Gateways событий
     */
    require('events').EventEmitter.defaultMaxListeners = 15;
})()
