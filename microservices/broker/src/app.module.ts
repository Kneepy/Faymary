import { CommentsGateway, DialogsGateway, ServerGateway } from './gateways';
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
import {CommentsController, DialogsControllerer, PostController, StoriesController, UserController} from "./controllers";
import {APP_FILTER, APP_GUARD} from "@nestjs/core";
import {RpcExceptionFilter} from "./rpc-exception.filter";
import { AuthGuard } from './auth.guard';

const Gateways = [CommentsGateway, ServerGateway, DialogsGateway]
const Clients = [LikesClient, UsersClient, StoreClient, SessionClient, PostClient, NotificationsClient, MessagesClient, DialogsClient, StoriesClient, CommentsClient, MailClient]
const Controllers = [UserController, PostController, StoriesController, CommentsController, DialogsControllerer]

@Module({
    imports: [
        ClientsModule.register([LikesClientDependency, UsersClientDependency, StoreClientDependency, SessionClientDependency, PostClientDependency, NotificationsClientDependency, MessagesClientDependency, DialogsClientDependency, StoriesClientDependency, CommentsClientDependency, MailClientDependency])
    ],
    controllers: Controllers,
    providers: [
        {
            provide: APP_FILTER,
            useClass: RpcExceptionFilter
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        },
        ...Clients,
        ...Gateways
    ]
})
export class AppModule {}
