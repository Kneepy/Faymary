import { UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { WriteFileInterceptor } from "../interceptors";

export const SaveFile = (fieldName: string = "file") => UseInterceptors(FileInterceptor(fieldName), WriteFileInterceptor)

export const SaveFiles = (fieldName: string = "files") => UseInterceptors(FilesInterceptor(fieldName), WriteFileInterceptor)