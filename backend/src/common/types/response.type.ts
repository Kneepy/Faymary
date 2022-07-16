export interface ICustomResponse extends Response {
    cookie(name: string, cookie: any, options): any;
}
