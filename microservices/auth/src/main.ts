import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { SESSION_PACKAGE_NAME, SESSION_PROTO_PATH } from "./constants/session.constants";
import { AuthModule } from "./auth.module";

(async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
        transport: Transport.GRPC,
        options: {
            package: SESSION_PACKAGE_NAME,
            protoPath: SESSION_PROTO_PATH  
        }
    })

    await app.listen();
})()
