import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NextFunction } from "express";
import useragent from "express-useragent"
import { ICustomRequest } from "./common";

export function middlware(app: INestApplication): INestApplication {
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe())
    app.use(useragent.express())
    app.use((req: ICustomRequest, res, next: NextFunction) => {
        if(!req.session.useragent) {
            req.session.useragent = req.useragent
        }
        return next()
    })

    return app;
}
