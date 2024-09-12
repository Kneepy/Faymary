import { File } from "src/entities";

export interface ICustomFile extends Express.Multer.File {
    savedAs: File
}