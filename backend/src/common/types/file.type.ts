import { Files } from "src/entity";

export interface ICustomFile extends Express.Multer.File {
    savedAs: Files;
}
