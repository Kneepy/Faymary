import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { MODULE_HOST, USER_PACKAGE_NAME, USER_PROTO_PATH } from "./constants/user.constants";
import { AppModule } from "./user.module";

(async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            package: USER_PACKAGE_NAME,
            protoPath: USER_PROTO_PATH,
            url: MODULE_HOST,
            loader: {
                keepCase: true
            }
        }
    })

    await app.listen();
    Logger.log("User service successfully started")
})()
