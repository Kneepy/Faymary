import type useragent from "ua-parser-js";
import type net from "node:net";
import { ICustomHeaders } from "./headers.type";
export interface ICustomRequest extends Request {
    ip: string;
    cookie: {
        refreshToken: string;
    };
    useragent?: useragent.IResult;
    session: {
        useragent?: string;
    };
    socket?: net.Socket;
    headers: ICustomHeaders;
    user: {
        userId: string
    }
}
