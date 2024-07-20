import {GetModuleConfig, GetProtoPath} from "../app-clients.utils";
import {
    AUTH_MS_HOST, COMMENTS_MS_HOST, DIALOGS_MS_HOST,
    LIKES_MS_HOST, MAIL_MS_HOST, MESSAGES_MS_HOST,
    NOTIFICATIONS_MS_HOST,
    POSTS_MS_HOST, PROFILES_MS_HOST,
    STORE_MS_HOST, STORIES_MS_HOST,
    USER_MS_HOST
} from "./hosts.constants";

export const APP_PORT = 5000;

export const DEFAULT_HOST = "localhost"

export const COOKIE_REFRESH_TOKEN_NAME = "refresh_token"
export const REQUEST_FIELD_ACCESS_TOKEN = "authorization"
export const AUTH_COOKIE_OPTIONS = {httpOnly: true, secure: true, maxAge: 60*60*24*14, path: "/"}

export const USE_AUTH_METADATA = "UseAuthMetadata"

export const LIKES_MODULE_CONFIG = GetModuleConfig({port: 5001, pkgName: "likes", host: LIKES_MS_HOST, protoPath: GetProtoPath("likes"), serviceName: "LikesService"})
export const USER_MODULE_CONFIG = GetModuleConfig({port: 5002, pkgName: "user", host: USER_MS_HOST, protoPath: GetProtoPath("user"), serviceName: "UserService"})
export const STORE_MODULE_CONFIG = GetModuleConfig({port: 5008, pkgName: "store", host: STORE_MS_HOST, protoPath: GetProtoPath("store"), serviceName: "StoreService"})
export const SESSION_MODULE_CONFIG = GetModuleConfig({port: 5007, pkgName: "session", host: AUTH_MS_HOST, protoPath: GetProtoPath("session"), serviceName: "SessionService"})
export const POST_MODULE_CONFIG = GetModuleConfig({port: 5006, pkgName: "posts", host: POSTS_MS_HOST, protoPath: GetProtoPath("post"), serviceName: "PostService"})
export const NOTIFICATIONS_MODULE_CONFIG = GetModuleConfig({port: 5005, pkgName: "notifications", host: NOTIFICATIONS_MS_HOST, protoPath: GetProtoPath("notification"), serviceName: "NotificationsService"})
export const MESSAGES_MODULE_CONFIG = GetModuleConfig({port: 5004, pkgName: "messages", host: MESSAGES_MS_HOST, protoPath: GetProtoPath("messages"), serviceName: "MessagesService"})
export const DIALOGS_MODULE_CONFIG = GetModuleConfig({port: 5003, pkgName: "dialogs", host: DIALOGS_MS_HOST, protoPath: GetProtoPath("dialogs"), serviceName: "DialogsService"})
export const STORIES_MODULE_CONFIG = GetModuleConfig({port: 5009, pkgName: "stories", host: STORIES_MS_HOST, protoPath: GetProtoPath("stories"), serviceName: "StoriesService"})
export const COMMENTS_MODULE_CONFIG = GetModuleConfig({port: 5010, pkgName: "comments", host: COMMENTS_MS_HOST, protoPath: GetProtoPath("comments"), serviceName: "CommentsService"})
export const MAIL_MODULE_CONFIG = GetModuleConfig({port: 5011, pkgName: "mail", host: MAIL_MS_HOST, protoPath: GetProtoPath("mail"), serviceName: "MailService"})
export const PROFILES_MODULE_CONFIG = GetModuleConfig({port: 5012, pkgName: "profiles", host: PROFILES_MS_HOST, protoPath: GetProtoPath("profiles"), serviceName: "ProfilesService"})