import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Res, UploadedFile, UploadedFiles } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { createReadStream } from "fs";
import * as path from "path";
import { SaveFile, SaveFiles } from "./decorators/save-file.decorator";
import { StoreResource } from "./providers";
import { STORE_FOLDER_PATH, STORE_SERVICE, STORE_SERVICE_METHODS } from "./constants/store.constants";
import { ICustomFile, ICustomResponse } from "./types";
import { FILE_NOT_FOUND } from "./constants";
import { File } from "./entities";
import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { RemoveFileDTO } from "./dtos";

@Controller()
export class StoreController {
    constructor(
        private storeResource: StoreResource
    ) {}

    @Post()
    @SaveFile()
    async createFile(@UploadedFile() file: ICustomFile): Promise<File> {
        return file.savedAs
    }

    @Post()
    @SaveFiles()
    async createFiles(@UploadedFiles() files: ICustomFile[]): Promise<File[]> {
        return files.map(file => file.savedAs)
    }

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

    @GrpcMethod(STORE_SERVICE, STORE_SERVICE_METHODS.REMOVE_FILE) 
    async deleteFileGrpc(data: RemoveFileDTO, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<any> {
        return await this.deleteFile(data.id)
    }
    
    async deleteFile(id: string): Promise<any> {
        return await this.storeResource.delete(id)
    }
}