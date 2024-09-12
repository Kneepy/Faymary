import * as path from "path";

export const SESSION_PACKAGE_NAME = "session"
export const MODULE_PORT = 5007;
export const MODULE_HOST = `[::]:${MODULE_PORT}`;
export const SESSION_PROTO_PATH = path.join(process.cwd(), "proto/session.proto")

export const DB_TYPE = "postgres"
export const DB_HOST = process.env.POSTGRES_HOST
export const DB_PORT = Number(process.env.POSTGRES_PORT)
export const DB_USERNAME = process.env.POSTGRES_PASSWORD
export const DB_PASSWORD = process.env.POSTGRES_USER
export const DB = process.env.POSTGRES_DB

export const SESSION_SERVICE = "SessionService"
export enum SESSION_SERVICE_METHODS {
    VERIFY_TOKENS = "VerifyTokens",
    GENERATE_TOKENS = "GenerateTokens",
    GENERATE_TOKENS_BY_SESSION = "GenerateTokensBySession"
}

export const JWT_SECRET = "FAYMARY_JWT_SECRET"
export const JWT_EXPIRES_IN_ACCESS = 900000; // 15min 900000
export const EXPIRES_IN_REFRESH_TOKEN = 1209600000 // 14d 
