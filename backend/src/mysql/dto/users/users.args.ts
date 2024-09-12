import { IsString, IsUUID, IsEmail, IsOptional } from "class-validator";

export class UsersArgs {
    @IsString()
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    userName?: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;
}
