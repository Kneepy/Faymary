import { IncomingHttpHeaders } from "http2";

export interface ICustomHeaders extends IncomingHttpHeaders{
    authorization: string;
    fingerprint: string;
}
