import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Users } from "src/entity";

export class ManySessionsArgs {
    @IsOptional()
    @IsNumber()
    id?: string;

    @IsOptional()
    @Type(() => Users)
    user?: Users;
}

export class SessionsArgs {
    @IsOptional()
    @IsNumber()
    id?: string;

    @IsString()
    @IsOptional()
    token?: string;
}