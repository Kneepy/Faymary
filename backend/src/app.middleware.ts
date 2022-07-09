import type { INestApplication } from "@nestjs/common";

export function middlware(app: INestApplication): INestApplication {
    app.enableCors();

    return app;
}
