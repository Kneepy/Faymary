import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as path from "path";
import * as multer from "multer"
import { STORE_FOLDER_PATH } from "./constants";
import { ICustomRequest } from "./types";

export const GetMulterConfig = (): MulterOptions => ({
    dest: STORE_FOLDER_PATH,
    storage: multer.diskStorage({
        destination: (req: ICustomRequest, file, cb) => {
            cb(null, STORE_FOLDER_PATH);
        },
        filename: (req, file, cb) => {
            const extname = path.extname(file.originalname)

            cb(null, Buffer.from(`${Date.now()}`).toString("base64") + (!!extname ? extname : ".png"));
        }
    })
})