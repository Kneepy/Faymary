import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import * as useragent from "express-useragent";
import { ICustomRequest } from "./common";

export function middlware(app: INestApplication): INestApplication {
    app.enableCors();

    app.useGlobalPipes(new ValidationPipe());

    app.use(cookieParser());

    app.use(useragent.express());
    app.use((req: ICustomRequest, res, next) => {
        if (!req.session?.useragent) {
            req.session = Object.assign(req.session || {}, {useragent: req.useragent})
            req.session.useragent = req.useragent;
        }
        return next();
    });

    return app;
}
