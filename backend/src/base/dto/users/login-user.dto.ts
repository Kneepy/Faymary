import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsString()
    @MinLength(7)
    password: string;
}
