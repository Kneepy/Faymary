import * as path from "path";

export const SESSION_PACKAGE_NAME = "session"
export const MODULE_PORT = 5007;
export const MODULE_HOST = `localhost:${MODULE_PORT}`;
export const SESSION_PROTO_PATH = path.join(process.cwd(), "proto/session.proto")

export const SESSION_SERVICE = "SessionService"
export enum SESSION_SERVICE_METHODS {
    VERIFY_TOKENS = "VerifyTokens",
    GENERATE_TOKENS = "GenerateTokens"
}

export const JWT_SECRET = "FAYMARY_JWT_SECRET"
export const JWT_EXPIRES_IN_ACCESS = 90000000000; // 15min 900000
export const EXPIRES_IN_REFRESH_TOKEN = 1209600000 // 14d 