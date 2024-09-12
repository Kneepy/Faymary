import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AddUserAccountDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @MinLength(7)
    @IsString()
    @IsNotEmpty()
    password: string;
}
