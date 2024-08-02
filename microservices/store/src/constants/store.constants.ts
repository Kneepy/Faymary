import { join } from "path"

export const STORE_PACKAGE_NAME = "store"
export const MODULE_PORT = 5008
export const MODULE_HOST = `[::]:${MODULE_PORT}`
export const STORE_PROTO_PATH = join(process.cwd(), "proto/store.proto")

export const STORE_PORT = 5014
export const STORE_FOLDER = process.env.STORE_FOLDER
export const STORE_FOLDER_PATH = join(process.cwd(), STORE_FOLDER)

export const DB_TYPE = "postgres"
export const DB_HOST = process.env.POSTGRES_HOST
export const DB_PORT = Number(process.env.POSTGRES_PORT)
export const DB_USERNAME = process.env.POSTGRES_PASSWORD
export const DB_PASSWORD = process.env.POSTGRES_USER
export const DB = process.env.POSTGRES_DB

export const STORE_SERVICE = "StoreService"
export enum STORE_SERVICE_METHODS {
    REMOVE_FILE = "RemoveFile",
    GET_FILE = "GetFile",
}