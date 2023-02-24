import { UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { WriteFileInterceptor } from "src/interceptors";

export const SaveFile = (field: string = "file") => 
    UseInterceptors(FileInterceptor(field), WriteFileInterceptor)

export const SaveFiles = (field: string = "files") => 
    UseInterceptors(FilesInterceptor(field), WriteFileInterceptor)