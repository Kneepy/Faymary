import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { ICustomRequest, ICustomResponse } from "./common";
<<<<<<< HEAD
import * as uaParser from "ua-parser-js"
import { ValPipe } from "./base/decorators/user-exist.decorator";
=======
import * as uaParser from "ua-parser-js";
import { AuthGuard, AuthService } from "./auth";
import { SessionService } from "./mysql";
import { Reflector } from "@nestjs/core";
>>>>>>> hotfix

export function middlware(app: INestApplication): INestApplication {
    app.enableCors();

    app.useGlobalPipes(new ValidationPipe(), new ValPipe());


    /* костыль для инициации глобального защитника 
    const sessionService = app.get(SessionService)
    const authService = app.get(AuthService)
    const reflector = app.get(Reflector)
    app.useGlobalGuards(new AuthGuard(sessionService, authService, reflector))
    */
    

    app.use(cookieParser());

    app.use((req: ICustomRequest, res, next) => {
<<<<<<< HEAD
        const ua = uaParser(req.headers["user-agent"])
        req.useragent = ua
        if (!req.session) req.session = {}
        req.session.useragent = JSON.stringify(ua, null, '  ')
        return next();
=======
        const ua = uaParser(req.headers["user-agent"]);
        req.useragent = ua;
        if (!req.session) req.session = {};
        req.session.useragent = JSON.stringify(ua, null, "  ");
        
        next();
>>>>>>> hotfix
    });

    app.use((req: ICustomRequest, res: ICustomResponse, next) => {
        if (req.headers.authorization) {
            const authorizationHeader = req.headers.authorization.split(" ");
            if (authorizationHeader[0] === "Bearer") {
                req.headers.authorization = authorizationHeader[1];
            }
<<<<<<< HEAD
        } catch (e) {
            next()
=======
>>>>>>> hotfix
        }
        next();
    });

    return app;
}
