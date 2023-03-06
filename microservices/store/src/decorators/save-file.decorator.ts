import { applyDecorators, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { WriteFileInterceptor } from "src/interceptors";
import { UserExistHttp } from "src/user-exist.guard";

export const SaveFile = (field: string = "file") => 
    applyDecorators(UseInterceptors(FileInterceptor(field), WriteFileInterceptor(field, false)), UseGuards(UserExistHttp))

export const SaveFiles = (field: string = "files") => 
    applyDecorators(UseInterceptors(FileInterceptor(field), WriteFileInterceptor(field, true)), UseGuards(UserExistHttp))
