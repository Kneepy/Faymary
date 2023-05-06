import * as path from "path";

export const MODULE_PACKAGE_NAME = "posts"
export const MODULE_PORT = 5006
export const MODULE_HOST = `localhost:${MODULE_PORT}`
export const POST_PROTO_PATH = path.join(process.cwd(), "proto/post.proto")

export const DEFAULT_TAKE_POSTS = 15;
export const DEFAULT_SKIP_POSTS = 0;

export const MODULE_SERVICE_NAME = "PostService"
export enum MODULE_SERVICE_METHODS {
    CREATE_POST = "CreatePost", 
    UPDATE_POST = "UpdatePost", 
    DELETE_POST = "DeletePost", 
    GET_POST = "GetPost", 
    GET_POSTS = "GetPosts"
}