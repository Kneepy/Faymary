import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sessions } from "./entities";
import { AuthController } from "./auth.controller";
import { JwtModule } from '@nestjs/jwt';
import { DB, DB_HOST, DB_PASSWORD, DB_PORT, DB_TYPE, DB_USERNAME, JWT_EXPIRES_IN_ACCESS, JWT_SECRET } from "./constants/session.constants";
import { AuthService, SessionService } from "./services";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DB_TYPE,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,
            entities: [Sessions],
            synchronize: true
        }),
        TypeOrmModule.forFeature([Sessions]),
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: {expiresIn: JWT_EXPIRES_IN_ACCESS}
        })
    ],
    controllers: [AuthController],
    providers: [SessionService, AuthService]
})
export class AuthModule {}
