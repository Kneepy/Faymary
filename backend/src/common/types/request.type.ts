import type useragent from "express-useragent";
import type net from "node:net";
import type cookieParser from "cookie-parser";
export interface ICustomRequest extends Request {
    cookie: any
    useragent?: useragent.Details | undefined;
    session: {
        useragent?: useragent.Details | undefined;
    };
    socket?: net.Socket;
}
