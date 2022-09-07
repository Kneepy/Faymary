import { Expose } from "class-transformer";
import type { CookieOptions } from "express";

@Expose()
export class ICustomResponse extends Response {
    cookie: (name: string, cookie: any, options: CookieOptions) => any;
    redirect: (status: number, url: string) => any;
}
