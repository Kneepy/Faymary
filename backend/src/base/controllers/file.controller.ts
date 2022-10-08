import { Controller, Get, Param, Post, Res, UploadedFile, UploadedFiles } from "@nestjs/common";
import { createReadStream } from "fs";
import * as path from "path";
import { DisableAuth } from "src/auth";
import { ICustomFile, ICustomResponse } from "src/common";
import { ConfigService } from "src/config";
import { Files } from "src/entity";
import { FilesService } from "src/mysql";
import { SaveFile, SaveFiles } from "../decorators";

@Controller("/file")
export class FileController {
    constructor(
        private filesService: FilesService,
        private configService: ConfigService
    ) {}

    @Get(":filename")
    @DisableAuth()
    public async getFile(@Param("filename") filename: string, @Res({passthrough: true}) res: ICustomResponse) {
        const file = await this.filesService.findOne({filename})
        const stream = createReadStream(path.join(this.configService.getStaticOptions().rootPath, file.filename + file.extname))

        stream.pipe(res)
    }

    @Post("/upload")
    @SaveFile("file")
    public async uploadOneFile(
        @UploadedFile() file: ICustomFile
    ): Promise<Files> {
        return file.savedAs;
    }

    @Post("/upload/multiply")
    @SaveFiles("files")
    public async uploadManyFiles(
        @UploadedFiles() files: ICustomFile[]
    ): Promise<Files[]> {
        return files.map(file => file.savedAs);
    }
}
