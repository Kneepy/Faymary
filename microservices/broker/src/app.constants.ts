import * as path from "path"
import * as process from "process";

export const APP_PORT = 5000;

export const DEFAULT_HOST = 'localhost'
interface ConfingModuleArgs {
    port: number,
    pkgName: string,
    host: string,
    protoPath: string,
    serviceName: string
}
interface ConfigModule {
    PORT: number,
    PACKAGE: string,
    HOST: string,
    PROTO: string,
    SERVICE: string
}

export const getModuleConfig = (data: ConfingModuleArgs): ConfigModule => ({
    PORT: data.port,
    PACKAGE: data.pkgName,
    HOST: `${data.host}:${data.port}`,
    PROTO: data.protoPath,
    SERVICE: data.serviceName
})
const getProtoPath = (protoFileName: string) => path.join(process.cwd(), `src/proto/${protoFileName}.proto`)

export const USER_MODULE_CONFIG = getModuleConfig({port: 5002, pkgName: "user", host: DEFAULT_HOST, protoPath: getProtoPath("user"), serviceName: "UserService"})
export const STORIES_MODULE_CONFIG = getModuleConfig({port: 5009, pkgName: "stories", host: DEFAULT_HOST, protoPath: getProtoPath("stories"), serviceName: "StoriesService"})
export const STORE_MODULE_CONFIG = getModuleConfig({port: 5008, pkgName: "store", host: DEFAULT_HOST, protoPath: getProtoPath("store"), serviceName: "StoreService"})
export const SESSION_MODULE_CONFIG = getModuleConfig({port: 5007, pkgName: "session", host: DEFAULT_HOST, protoPath: getProtoPath("session"), serviceName: "SessionService"})
export const POST_MODULE_CONFIG = getModuleConfig({port: 5006, pkgName: "post", host: DEFAULT_HOST, protoPath: getProtoPath("post"), serviceName: "PostService"})
export const NOTIFICATIONS_MODULE_CONFIG = getModuleConfig({port: 5005, pkgName: "notifications", host: DEFAULT_HOST, protoPath: getProtoPath("notification"), serviceName: "NotificationsService"})
export const MESSAGES_MODULE_CONFIG = getModuleConfig({port: 5004, pkgName: "messages", host: DEFAULT_HOST, protoPath: getProtoPath("messages"), serviceName: "MessagesSerivce"})
export const DIALOGS_MODULE_CONFIG = getModuleConfig({port: 5003, pkgName: "dialogs", host: DEFAULT_HOST, protoPath: getProtoPath("dialogs"), serviceName: "DialogsService"})
export const LIKES_MODULE_CONFIG = getModuleConfig({port: 5001, pkgName: "likes", host: DEFAULT_HOST, protoPath: getProtoPath("likes"), serviceName: "LikesService"})
export const COMMENTS_MODULE_CONFIG = getModuleConfig({port: 5011, pkgName: "comments", host: DEFAULT_HOST, protoPath: getProtoPath("comments"), serviceName: "CommentsService"})