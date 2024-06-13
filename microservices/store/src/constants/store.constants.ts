import { join } from "path"

export const STORE_PACKAGE_NAME = "store"
export const MODULE_PORT = 5008
export const MODULE_HOST = `localhost:${MODULE_PORT}`
export const STORE_PROTO_PATH = join(process.cwd(), "proto/store.proto")

export const STORE_FOLDER = "files"
export const STORE_FOLDER_PATH = join(process.cwd(), STORE_FOLDER)

export const DB_TYPE = "postgres"
export const DB_HOST = "127.0.0.1"
export const DB_PORT = 5432
export const DB_USERNAME = "postgres"
export const DB_PASSWORD = "postgres"
export const DB = "store"

export const STORE_SERVICE = "StoreService"
export enum STORE_SERVICE_METHODS {
    REMOVE_FILE = "RemoveFile"
}