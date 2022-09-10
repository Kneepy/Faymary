import { IsOptional, IsString, IsUUID } from "class-validator";

export class FilesArgs {
    @IsOptional()
    @IsUUID()
    @IsString()
    id: string;

    @IsOptional()
    path: string;
}
