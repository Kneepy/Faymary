import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { middlware } from "./app.middleware";
import { Logger } from "@nestjs/common";

async function bootstrap(): Promise<string> {
    const app = await NestFactory.create(AppModule);

    middlware(app);

    await app.startAllMicroservices()
    await app.listen(process.env.PORT || 5000);

    return app.getUrl();
}

(async () => {
    try {
        const url = await bootstrap();
        Logger.log(url, "Bootstrap");
    } catch (e) {
        Logger.log(e, "Bootstrap");
    }
})();
