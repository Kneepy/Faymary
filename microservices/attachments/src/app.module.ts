import { Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attachment, DB, DB_HOST, DB_PASSWORD, DB_PORT, DB_TYPE, DB_USERNAME } from "./common";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: DB_TYPE,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,
            entities: [ Attachment ],
            synchronize: true
        }),
        TypeOrmModule.forFeature([ Attachment ])
    ],
    controllers: [AttachmentsController],
    providers: [AttachmentsService],
})
export class AppModule {}
