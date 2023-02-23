import { Module } from '@nestjs/common';
import {LikesController} from "./controllers/likes.controller";
import {ClientsModule} from "@nestjs/microservices";
import {
    CommentsClient,
    CommentsClientDependency, DialogsClient,
    DialogsClientDependency,
    LikesClient,
    LikesClientDependency, MessagesClient,
    MessagesClientDependency, NotificationsClient,
    NotificationsClientDependency, PostClient,
    PostClientDependency, SessionClient,
    SessionClientDependency, StoreClient,
    StoreClientDependency, StoriesClient, StoriesClientDependency, UsersClient,
    UsersClientDependency
} from './app-clients.providers';

@Module({
    imports: [
        ClientsModule.register([LikesClientDependency, UsersClientDependency, StoreClientDependency, SessionClientDependency, PostClientDependency, NotificationsClientDependency, MessagesClientDependency, DialogsClientDependency, StoriesClientDependency, CommentsClientDependency])
    ],
    controllers: [LikesController],
    providers: [LikesClient, UsersClient, StoreClient, SessionClient, PostClient, NotificationsClient, MessagesClient, DialogsClient, StoriesClient, CommentsClient],
})
export class AppModule {}
