import { Controller, Get, Param, Post, UploadedFile, UploadedFiles } from "@nestjs/common";
import { createReadStream } from "fs";
import * as path from "path";
import { DisableAuth } from "src/auth";
import { ICustomFile } from "src/common";
import { Files } from "src/entity";
import { FilesService } from "src/mysql";
import { SaveFile, SaveFiles } from "../decorators";

@Controller("/file")
export class FileController {
    constructor(private filesService: FilesService) {}

    @Get(":filename")
    @DisableAuth()
    public async getFile(@Param("filename") filename: string) {
        const file = await this.filesService.findOne({filename})
        const stream = createReadStream(path.join(process.cwd(), file.filename, file.extname))

        stream.on("data", chank => console.log(chank))
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
