import { IsOptional, IsString, IsUUID } from "class-validator";
import { FindOperator } from "typeorm";

export class FilesArgs {
    @IsOptional()
    @IsUUID()
    @IsString()
    id?: string;

    @IsOptional()
    path?: string;
}

export class ManyFilesArgs {
    @IsOptional()
    @IsUUID()
    @IsString()
    id?: FindOperator<any> | string

    @IsOptional()
    path?: FindOperator<any> | string
}