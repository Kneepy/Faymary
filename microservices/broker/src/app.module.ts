import { CommentsGateway, DialogsGateway, LikesGateway, MessagesGateway, ServerGateway, UsersGateway } from './gateways';
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
    PostClientDependency, ProfilesClient, ProfilesClientDependency, SessionClient,
    SessionClientDependency, StoreClient,
    StoreClientDependency, StoriesClient, StoriesClientDependency, UsersClient,
    UsersClientDependency
} from './app-clients.providers';
import {CommentsController, DialogsControllerer, NotificationController, PostController, StoriesController, UserController} from "./controllers";
import {APP_FILTER, APP_GUARD} from "@nestjs/core";
import {RpcExceptionFilter} from "./rpc-exception.filter";
import { AuthGuard } from './auth.guard';
import { UtilsService } from './utils/get-item.util';

const Gateways = [CommentsGateway, ServerGateway, DialogsGateway, MessagesGateway, LikesGateway, UsersGateway]
const Clients = [LikesClient, UsersClient, StoreClient, SessionClient, PostClient, NotificationsClient, MessagesClient, DialogsClient, StoriesClient, CommentsClient, MailClient, ProfilesClient]
const Controllers = [UserController, PostController, StoriesController, CommentsController, DialogsControllerer, NotificationController]

@Module({
    imports: [
        ClientsModule.register([LikesClientDependency, UsersClientDependency, StoreClientDependency, SessionClientDependency, PostClientDependency, NotificationsClientDependency, MessagesClientDependency, DialogsClientDependency, StoriesClientDependency, CommentsClientDependency, MailClientDependency, ProfilesClientDependency])
    ],
    controllers: Controllers,
    providers: [
        UtilsService,
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
