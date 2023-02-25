import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { STORIES_PROTO_PATH, MODULE_PACKAGE_NAME, MODULE_HOST } from "./constants";

(async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.GRPC,
            options: {
                package: MODULE_PACKAGE_NAME,
                protoPath: STORIES_PROTO_PATH,
                url: MODULE_HOST
            }
        }
    );
    await app.listen();
})();
