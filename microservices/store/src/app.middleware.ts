import { INestApplication } from "@nestjs/common";

export function middlware(app: INestApplication): INestApplication {
    /**
     * Нужно будет поменять origin на конкретный хост FE
     */
    app.enableCors({origin: "http://localhost:3000", credentials: true});

    return app
}