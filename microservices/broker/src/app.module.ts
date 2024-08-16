import { CommentsGateway, DialogsGateway, MessagesGateway, ServerGateway, UsersGateway } from './gateways';
import { Module } from '@nestjs/common';
import { ClientsModule } from "@nestjs/microservices";
import {
    AttachmentsClient, AttachmentsClientDependency,
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
} from "./app-clients.providers";
import {CommentsController, DialogsController, NotificationController, PostController, StoriesController, UserController} from "./controllers";
import {APP_FILTER, APP_GUARD} from "@nestjs/core";
import {RpcExceptionFilter} from "./rpc-exception.filter";
import { AuthGuard } from './auth.guard';
import { AttachmentsProvider } from "./providers";

const Gateways = [CommentsGateway, ServerGateway, DialogsGateway, MessagesGateway, UsersGateway]
const Controllers = [UserController, PostController, StoriesController, CommentsController, DialogsController, NotificationController]
const Providers = [AttachmentsProvider]
const Clients = [LikesClient, UsersClient, StoreClient, SessionClient, PostClient, NotificationsClient, MessagesClient, DialogsClient, StoriesClient, CommentsClient, MailClient, ProfilesClient, AttachmentsClient]

@Module({
    imports: [
        ClientsModule.register([
            LikesClientDependency,
            UsersClientDependency,
            StoreClientDependency,
            SessionClientDependency,
            PostClientDependency,
            NotificationsClientDependency,
            MessagesClientDependency,
            DialogsClientDependency,
            StoriesClientDependency,
            CommentsClientDependency,
            MailClientDependency,
            ProfilesClientDependency,
            AttachmentsClientDependency
        ])
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
        ...Providers,
        ...Clients,
        ...Gateways
    ]
})
export class AppModule {}
