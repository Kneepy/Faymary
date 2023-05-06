import {GetClientOptionsByConfig, GetClientProvider } from "./app-clients.utils";
import {
    COMMENTS_MODULE_CONFIG,
    DIALOGS_MODULE_CONFIG,
    LIKES_MODULE_CONFIG, MAIL_MODULE_CONFIG, MESSAGES_MODULE_CONFIG, NOTIFICATIONS_MODULE_CONFIG,
    POST_MODULE_CONFIG,
    PROFILES_MODULE_CONFIG,
    SESSION_MODULE_CONFIG,
    STORE_MODULE_CONFIG, STORIES_MODULE_CONFIG,
    USER_MODULE_CONFIG
} from "./constants/app.constants";
import { CommentsServiceClient } from "./proto/comments";
import { DialogsServiceClient } from "./proto/dialogs";
import {LikesServiceClient} from "./proto/likes";
import { MailServiceClient } from "./proto/mail";
import { MessagesSerivceClient } from "./proto/messages";
import { NotificationsServiceClient } from "./proto/notification";
import { PostServiceClient } from "./proto/post";
import { ProfilesServiceClient } from "./proto/profiles";
import { SessionServiceClient } from "./proto/session";
import { StoreServiceClient } from "./proto/store";
import { StoriesServiceClient } from "./proto/stories";
import {UserServiceClient} from "./proto/user"


// я хрен его знает как отслеживать правильность всех этих зависимостей но так прощё чем в ручную
// клиент это сервис который инжектистся с именем которое можно получить из *Client.provide или *_MODULE_CONFIG.PROVIDER (2 варик лучше)
export const LikesClient = GetClientProvider<LikesServiceClient>(LIKES_MODULE_CONFIG)
export const LikesClientDependency = GetClientOptionsByConfig(LIKES_MODULE_CONFIG)

export const UsersClient = GetClientProvider<UserServiceClient>(USER_MODULE_CONFIG)
export const UsersClientDependency = GetClientOptionsByConfig(USER_MODULE_CONFIG)

export const StoreClient = GetClientProvider<StoreServiceClient>(STORE_MODULE_CONFIG)
export const StoreClientDependency = GetClientOptionsByConfig(STORE_MODULE_CONFIG)

export const SessionClient = GetClientProvider<SessionServiceClient>(SESSION_MODULE_CONFIG)
export const SessionClientDependency = GetClientOptionsByConfig(SESSION_MODULE_CONFIG)

export const PostClient = GetClientProvider<PostServiceClient>(POST_MODULE_CONFIG)
export const PostClientDependency = GetClientOptionsByConfig(POST_MODULE_CONFIG)

export const NotificationsClient = GetClientProvider<NotificationsServiceClient>(NOTIFICATIONS_MODULE_CONFIG)
export const NotificationsClientDependency = GetClientOptionsByConfig(NOTIFICATIONS_MODULE_CONFIG)

export const MessagesClient = GetClientProvider<MessagesSerivceClient>(MESSAGES_MODULE_CONFIG)
export const MessagesClientDependency = GetClientOptionsByConfig(MESSAGES_MODULE_CONFIG)

export const DialogsClient = GetClientProvider<DialogsServiceClient>(DIALOGS_MODULE_CONFIG)
export const DialogsClientDependency = GetClientOptionsByConfig(DIALOGS_MODULE_CONFIG)

export const StoriesClient = GetClientProvider<StoriesServiceClient>(STORIES_MODULE_CONFIG)
export const StoriesClientDependency = GetClientOptionsByConfig(STORIES_MODULE_CONFIG)

export const CommentsClient = GetClientProvider<CommentsServiceClient>(COMMENTS_MODULE_CONFIG)
export const CommentsClientDependency = GetClientOptionsByConfig(COMMENTS_MODULE_CONFIG)

export const MailClient = GetClientProvider<MailServiceClient>(MAIL_MODULE_CONFIG)
export const MailClientDependency = GetClientOptionsByConfig(MAIL_MODULE_CONFIG)

export const ProfilesClient = GetClientProvider<ProfilesServiceClient>(PROFILES_MODULE_CONFIG)
export const ProfilesClientDependency = GetClientOptionsByConfig(PROFILES_MODULE_CONFIG)
