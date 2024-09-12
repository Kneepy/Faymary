import * as path from "path";

export const MODULE_PACKAGE_NAME = "stories";
export const MODULE_PORT = 5009
export const MODULE_HOST = `[::]:${MODULE_PORT}`
export const STORIES_PROTO_PATH = path.join(
    process.cwd(),
    "proto/stories.proto"
);

export const STORY_EXPIRES_AFTER = 86400000; // 1d

export const DB_TYPE = "postgres"
export const DB_HOST = process.env.POSTGRES_HOST
export const DB_PORT = Number(process.env.POSTGRES_PORT)
export const DB_USERNAME = process.env.POSTGRES_PASSWORD
export const DB_PASSWORD = process.env.POSTGRES_USER
export const DB = process.env.POSTGRES_DB

export const STORIES_SERVICE = "StoriesService";

export enum STORIES_SERVICE_METHODS {
    GET_STORIES = "GetStories",
    CREATE_STORY = "CreateStory",
    DELETE_STORY = "DeleteStory",
    UPDATE_STORY = "UpdateStory",
    GET_STORY = "GetStory"
}
