import { Module } from '@nestjs/common';
import { ClientsModule} from "@nestjs/microservices";
import {
    CommentsClient,
    CommentsClientDependency, DialogsClient,
    DialogsClientDependency,
    LikesClient,
    LikesClientDependency, MailClient, MailClientDependency, MessagesClient,
    MessagesClientDependency, NotificationsClient,
    NotificationsClientDependency, PostClient,
    PostClientDependency, SessionClient,
    SessionClientDependency, StoreClient,
    StoreClientDependency, StoriesClient, StoriesClientDependency, UsersClient,
    UsersClientDependency
} from './app-clients.providers';
import {UserController} from "./controllers";
import {APP_FILTER} from "@nestjs/core";
import {RpcExceptionFilter} from "./rpc-exception.filter";

@Module({
    imports: [
        ClientsModule.register([LikesClientDependency, UsersClientDependency, StoreClientDependency, SessionClientDependency, PostClientDependency, NotificationsClientDependency, MessagesClientDependency, DialogsClientDependency, StoriesClientDependency, CommentsClientDependency, MailClientDependency])
    ],
    controllers: [UserController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: RpcExceptionFilter
        },
        LikesClient, UsersClient, StoreClient, SessionClient, PostClient, NotificationsClient, MessagesClient, DialogsClient, StoriesClient, CommentsClient, MailClient
    ]
})
export class AppModule {}
