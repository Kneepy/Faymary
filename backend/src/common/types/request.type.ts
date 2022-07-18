import type useragent from "express-useragent";
import type net from "node:net";
import { ICustomHeaders } from "./headers.type";
export interface ICustomRequest extends Request {
    ip: string;
    cookie: {
        refreshToken: string,
        accessToken: string 
    }
    useragent?: useragent.Details | undefined;
    session: {
        useragent?: useragent.Details | undefined;
    };
    socket?: net.Socket;
    headers: ICustomHeaders
}
