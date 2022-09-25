import { IsString, IsUUID, IsEmail, IsOptional } from "class-validator";

export class UsersArgs {
    @IsString()
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;
}