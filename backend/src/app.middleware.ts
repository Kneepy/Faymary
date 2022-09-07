import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { ICustomRequest, ICustomResponse } from "./common";
import * as uaParser from "ua-parser-js";
import { Transport } from "@nestjs/microservices";
import { WsAdapter } from "@nestjs/platform-ws";

export function middlware(app: INestApplication): INestApplication {
    app.enableCors();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));  // { whitelist: true } нужно как-то фильтровать входные свойства
    //app.useGlobalInterceptors(new ClassSerializerInterceptor({excludeExtraneousValues: true}))

    app.use(cookieParser());

    app.useWebSocketAdapter(new WsAdapter(app));

    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [`amqp://localhost:5672`],
            queue: "websocket",
            queueOptions: { durable: false }
        }
    });

    // user-agent
    app.use((req: ICustomRequest, res, next) => {
        const ua = uaParser(req.headers["user-agent"]);
        req.useragent = ua;
        if (!req.session) req.session = {};
        req.session.useragent = JSON.stringify(ua, null, "  ");

        next();
    });

    // auth header
    app.use((req: ICustomRequest, res: ICustomResponse, next) => {
        if (req.headers.authorization) {
            const authorizationHeader = req.headers.authorization.split(" ");
            if (authorizationHeader[0] === "Bearer") {
                req.headers.authorization = authorizationHeader[1];
            }
        }
        next();
    });

    return app;
}
