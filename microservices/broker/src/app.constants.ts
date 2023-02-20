import { Transport } from "@nestjs/microservices";
import * as path from "path"
import * as process from "process";

export const APP_PORT = 5000;

// LIKES PACKAGE
export const LIKES_MODULE_PORT = 5001;
export const LIKES_MODULE = "LIKES_MODULE"
export const LIKES_MODULE_PKG = "likes";
export const LIKES_MODULE_HOST = `localhost:${LIKES_MODULE_PORT}`;
export const LIKES_MODULE_PROTO = path.join(process.cwd(), "src/proto/likes.proto");
export const LIKES_SERVICE = "LikesService";