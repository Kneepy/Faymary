import type useragent from "express-useragent";
import type net from "node:net";

export interface ICustomRequest extends Request {
    useragent?: useragent.Details | undefined;
    session: {
        useragent?: useragent.Details | undefined;
    };
    socket?: net.Socket;
}
