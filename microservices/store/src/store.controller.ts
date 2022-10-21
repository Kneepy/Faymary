import { Body, Controller, Get, NotFoundException, Param, Post, Res, UploadedFile, UploadedFiles } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { createReadStream } from "fs";
import * as path from "path";
import { SaveFile, SaveFiles } from "./decorators/save-file.decorator";
import { StoreResource } from "./providers";
import { STORE_FOLDER_PATH } from "./constants/store.constants";
import { ICustomFile, ICustomResponse } from "./types";
import { FILE_NOT_FOUND } from "./constants";

@Controller()
export class StoreController {
    constructor(
        private storeResource: StoreResource
    ) {}

    @Post()
    @SaveFile()
    async createFile(@UploadedFile() file: ICustomFile) {}

    @Post()
    @SaveFiles()
    async createFiles(@UploadedFiles() files: ICustomFile[]) {}

    @GrpcMethod()
    @Get(":filename")
    async getFiles(@Param("filename") filename: string, @Res() res: ICustomResponse) {
        const file = await this.storeResource.findOne({filename})

        if(file) {
            const stream = createReadStream(path.join(STORE_FOLDER_PATH, file.filename + file.extname))

            stream.pipe(res)
        }
        else {
            throw new NotFoundException(FILE_NOT_FOUND)
        }
    }

    @GrpcMethod() 
    async deleteFiles() {}
}