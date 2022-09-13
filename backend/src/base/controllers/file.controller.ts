import { Controller, Post, UploadedFile, UploadedFiles } from "@nestjs/common";
import { ICustomFile } from "src/common";
import { Files } from "src/entity";
import { FilesService } from "src/mysql";
import { SaveFile, SaveFiles } from "../decorators";

@Controller("/file")
export class FileController {

    @Post("/upload/one")
    @SaveFile("file")
    public async uploadOneFile(
        @UploadedFile() file: ICustomFile
    ): Promise<Files> {
        return file.savedAs
    }

    @Post("/upload/many")
    @SaveFiles("files")
    public async uploadManyFiles(
        @UploadedFiles() files: ICustomFile[]
    ): Promise<Files[]> {
        return files.map(file => file.savedAs)
    }
}