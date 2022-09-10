import type useragent from "ua-parser-js";
import type net from "node:net";
import { ICustomHeaders } from "./headers.type";
import { Expose } from "class-transformer";
import { ICustomFile } from "./file.type";
import { Request } from "express";

export interface ICustomRequest extends Request {
    ip: string;
    cookies: {
        refreshToken: string;
    };
    useragent: useragent.IResult;
    session: {
        useragent?: string;
    };
    socket: net.Socket;
    headers: ICustomHeaders;
    file: ICustomFile;
    files: ICustomFile[];
    user: {
        userId: string;
    };
}
