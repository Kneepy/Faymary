import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sessions } from "./entities";
import { AuthController } from "./auth.controller";
import { SessionService } from "./services/session.service";
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRES_IN_ACCESS, JWT_SECRET } from "./constants/session.constants";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "root",
            database: "user",
            entities: [Sessions],
            synchronize: true
        }),
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: {expiresIn: JWT_EXPIRES_IN_ACCESS}
        })
    ],
    controllers: [AuthController],
    providers: [SessionService]
})
export class AuthModule {}
