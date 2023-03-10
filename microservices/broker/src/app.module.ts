import { CommentsGateway, ServerGateway } from './gateways';
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
import {PostController, StoriesController, UserController} from "./controllers";
import {APP_FILTER, APP_GUARD} from "@nestjs/core";
import {RpcExceptionFilter} from "./rpc-exception.filter";
import { AuthGuard } from './auth.guard';

const Gateways = [CommentsGateway, ServerGateway]

@Module({
    imports: [
        ClientsModule.register([LikesClientDependency, UsersClientDependency, StoreClientDependency, SessionClientDependency, PostClientDependency, NotificationsClientDependency, MessagesClientDependency, DialogsClientDependency, StoriesClientDependency, CommentsClientDependency, MailClientDependency])
    ],
    controllers: [UserController, PostController, StoriesController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: RpcExceptionFilter
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        },
        LikesClient, UsersClient, StoreClient, SessionClient, PostClient, NotificationsClient, MessagesClient, DialogsClient, StoriesClient, CommentsClient, MailClient,
        ...Gateways
    ]
})
export class AppModule {}
