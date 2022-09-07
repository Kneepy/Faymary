import type useragent from "ua-parser-js";
import type net from "node:net";
import { ICustomHeaders } from "./headers.type";
import { Expose } from "class-transformer";

@Expose()
export class ICustomRequest extends Request {
    ip: string;
    cookies: {
        refreshToken: string;
    };
    useragent?: useragent.IResult;
    session: {
        useragent?: string;
    };
    socket?: net.Socket;
    headers: ICustomHeaders;
    user: {
        userId: string;
    };
}
