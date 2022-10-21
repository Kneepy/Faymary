import type { Request } from "express";
import { ICustomFile } from "./file.type";

export interface ICustomRequest extends Request {
    file: ICustomFile
    files: ICustomFile[]
    headers: {
        authorization: string
    }
}