import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { USER_PACKAGE_NAME, USER_PROTO_PATH } from "./constants/user.constants";
import { AppModule } from "./user.module";

(async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            package: USER_PACKAGE_NAME,
            protoPath: USER_PROTO_PATH  
        }
    })
    await app.listen();
})()
