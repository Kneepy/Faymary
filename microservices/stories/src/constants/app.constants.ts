import * as path from "path";

export const MODULE_PACKAGE_NAME = "stories";
export const MODULE_PORT = 5009
export const MODULE_HOST = `localhost:${MODULE_PORT}`
export const STORIES_PROTO_PATH = path.join(
    process.cwd(),
    "proto/stories.proto"
);

export const STORY_EXPIRES_AFTER = 86400000; // 1d

export const DB_TYPE = "postgres"
export const DB_HOST = "127.0.0.1"
export const DB_PORT = 5432
export const DB_USERNAME = "postgres"
export const DB_PASSWORD = "postgres"
export const DB = "stories"

export const STORIES_SERVICE = "StoriesService";

export enum STORIES_SERVICE_METHODS {
    GET_STORIES = "GetStories",
    CREATE_STORY = "CreateStory",
    DELETE_STORY = "DeleteStory",
    UPDATE_STORY = "UpdateStory",
    GET_STORY = "GetStory"
}
