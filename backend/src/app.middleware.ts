import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { ICustomRequest, ICustomResponse } from "./common";
import * as uaParser from "ua-parser-js";

export function middlware(app: INestApplication): INestApplication {
    app.enableCors();

    app.useGlobalPipes(new ValidationPipe({whitelist: true}))

    app.use(cookieParser());

    app.use((req: ICustomRequest, res, next) => {
        const ua = uaParser(req.headers["user-agent"]);
        req.useragent = ua;
        if (!req.session) req.session = {};
        req.session.useragent = JSON.stringify(ua, null, "  ");

        next();
    });

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
