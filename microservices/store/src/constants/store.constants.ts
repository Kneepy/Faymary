import { join } from "path"

export const STORE_PACKAGE_NAME = "store"
export const STORE_PROTO_PATH = join(process.cwd(), "proto/store.proto")

export const STORE_FOLDER = "store"
export const STORE_FOLDER_PATH = join(process.cwd(), STORE_FOLDER)

export const STORE_SERVICE = "StoreService"
export enum STORE_SERVICE_METHODS {
    REMOVE_FILE = "RemoveFile"
}