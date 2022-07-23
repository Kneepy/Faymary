import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { ICustomRequest, ICustomResponse } from "./common";
import uaParser from "ua-parser-js"
import { ValPipe } from "./base/decorators/user-exist.decorator";

export function middlware(app: INestApplication): INestApplication {
    app.enableCors();

    app.useGlobalPipes(new ValidationPipe(), new ValPipe());

    app.use(cookieParser());

    app.use((req: ICustomRequest, res, next) => {
        const ua = uaParser(req.headers["user-agent"])
        req.useragent = ua
        if (!!req.session) req.session = {}
        req.session.useragent = JSON.stringify(ua, null, '  ')
        return next();
    });

    app.use((req: ICustomRequest, res: ICustomResponse, next) => {
        try {
            const authorizationHeader = req.headers.authorization.split(" ")
            if(authorizationHeader[0] === "Bearer") {
                req.headers.authorization = authorizationHeader[1]
            }
        } catch (e) {
            next(e)
        }
    })

    return app;
}
