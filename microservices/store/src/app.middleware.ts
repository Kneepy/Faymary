import { INestApplication } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { ICustomRequest } from "./types";

export function middlware(app: INestApplication): INestApplication {
    app.use((req: ICustomRequest, res: Response, next) => {
        if (req.headers.authorization) {
            const authorizationHeader = req.headers.authorization.split(" ");

            req.headers.authorization = authorizationHeader[0] === "Bearer" ? authorizationHeader[1] : authorizationHeader[0]
        }
        next();
    });

    return app
}